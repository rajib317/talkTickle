const createError = require('http-errors');
const {
  userSchema,
  pinSchema,
  passSchema,
} = require('../util/validation_schema');
const User = require('../models/User.Model');
const Login = require('../models/Login.Model');
const bcrypt = require('bcrypt');

const sequelize = require('../util/init_mysql');

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../util/jwt_helper');
const generatePin = require('../util/generate_pin');
const axios = require('axios');
const emailer = require('../util/emailer');
module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await userSchema.validateAsync(req.body);

      const doesExists = await User.findOne({ where: { email: result.email } });
      if (doesExists)
        throw createError.Conflict(`${result.email} is already registered`);

      // const salt = await bcrypt.genSalt(10);
      // const hasedPassword = await bcrypt.hash(result.password, salt);

      const savedUser = await sequelize.transaction(async (t) => {
        const user = await User.create(
          {
            email: result.email,
          },
          { transaction: t }
        );

        await Login.create(
          {
            userId: user.id,
            isPinVerified: false,
            pin: generatePin(),
          },
          { transaction: t }
        );

        return user;
      });

      res.send({ message: 'User Created.' });

      // const accessToken = await signAccessToken(savedUser.dataValues.id);
      // const refreshToken = await signRefreshToken(savedUser.dataValues.id);
      // res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi) error.status = 422;
      next(error);
    }
  },

  verifyPin: async (req, res, next) => {
    try {
      const result = await pinSchema.validateAsync(req.body);

      const user = await User.findOne({ where: { email: result.email } });
      if (!user) throw createError.Unauthorized('User does not exist');
      const record = await Login.findOne({
        where: { userId: user.id, isPinVerified: false },
        order: [['createdAt', 'DESC']],
        limit: 1,
      });

      if (!record) throw createError.Unauthorized();

      if (record.pin !== +result.pin)
        throw createError.Unauthorized('Pin Does not match');

      record.update({ isPinVerified: true });

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      res.send({
        accessToken,
        refreshToken,
        message: 'Logged In!',
        loginLevel: 4,
      });
    } catch (error) {
      next(error);
    }
  },

  setPassword: async (req, res, next) => {
    try {
      const result = await passSchema.validateAsync(req.body);

      const user = await User.findOne({ where: { email: result.email } });
      if (!user) createError.Unauthorized();
      const salt = await bcrypt.genSalt(10);
      const hasedPassword = await bcrypt.hash(result.password, salt);

      user.update({ password: hasedPassword });

      res.send({ loginLevel: 2, message: 'password is set' });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    // if all ok send login level 3
    try {
      console.log('result.email', req.body);
      const result = await passSchema.validateAsync(req.body);

      const user = await User.findOne({ where: { email: result.email } });

      if (!user) throw createError.NotFound('User not Registered');

      const isMatch = await user.isValidPassword(result.password);

      if (!isMatch)
        throw createError.Unauthorized('Wrong Username or password');

      const [lastLogin] = await Login.findAll({
        limit: 1,
        attributes: ['isPinVerified', 'pin'],
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });

      const emailPayload = {
        to: user.email,
        subject: 'TalkTalker Login',
        text: '',
      };

      // If pin is not verified from the last time
      if (!lastLogin.dataValues.isPinVerified) {
        emailPayload.text = `Your pin is ${lastLogin.dataValues.pin}`;
      } else {
        // If there is no last attempt create the pin
        const pin = generatePin();
        const pinSet = await Login.create({
          userId: user.id,
          isPinVerified: false,
          pin,
        });
        if (!pinSet) throw createError.InternalServerError();
        emailPayload.text = `Your pin is ${pin}`;
      }

      const resEmail = await emailer(emailPayload);

      console.log(resEmail);

      if (!resEmail)
        throw createError.InternalServerError(
          'Could not send verification email'
        );
      res.send({ loginLevel: 3, message: resEmail.message });
    } catch (error) {
      if (error.isJoi)
        return next(
          createError.BadRequest(error.details.map((d) => d.message).join('. '))
        );
      if (axios.isAxiosError(error))
        return next(
          createError.InternalServerError(error?.response?.data?.message)
        );
      next(error);
    }
  },

  checkUser: async (req, res, next) => {
    console.log('HAHAHA');
    // if all ok send login level 1 or 2 depending on if user email is set to null or not.
    try {
      const result = await userSchema.validateAsync(req.body);

      const user = await User.findOne({ where: { email: result.email } });

      if (!user) throw createError.NotFound('User not Registered');

      // User is new and password is not set yet: login level 1
      if (user.password === null)
        res.send({ loginLevel: 1, message: 'Set new password' });
      res.send({ loginLevel: 2, message: 'Enter Password' });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      // const newRefreshToken = await signRefreshToken(userId);
      // Send the old token back as we'd like to ask the user to login after refresh token has expired
      res.send({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  },
};
