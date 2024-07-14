import { createPostSchema } from '../helpers/validation_schema';
import Post from '../models/Post.Model';
import { RequestHandler } from 'express';

export default {
  create: async (req, res, next) => {
    try {
      const result = await createPostSchema.validateAsync(req.body);

      await Post.create({
        description: result.description,
        image: result.image,
        voice: result.voice,
      });
      res.send({ message: 'post created!' });
    } catch (error) {
      next(error);
    }
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
} as { [key: string]: RequestHandler };
