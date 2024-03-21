const { createPostSchema } = require('../helpers/validation_schema');
const Post = require('../models/Post.Model');

module.exports = {
  create: async (req, res, next) => {
    const result = await createPostSchema.validateAsync(req.body);
    console.log(result);
    Post.create({
      description: result.description,
      image: result.images,
      voice: result.voice,
    });
  },
  recommended: async (req, res, next) => {},
  recent: async (req, res, next) => {
    try {
      console.log('req.headers');
      const result = await Post.findAll();
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
};
