const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const verifyAcessToken = (req, res, next) => {
  if (!req.headers['authorization'])
    return next(createHttpError.Unauthorized());

  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      return next(createHttpError.Unauthorized(message));
    }
    req.payload = payload.aud;
    next();
  });
};
module.exports = verifyAcessToken;
