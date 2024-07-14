import joi from 'joi';
import { PostCreateAttributes } from '../models/Post.Model';

export const createPostSchema: joi.ObjectSchema<PostCreateAttributes> =
  joi.object({
    description: joi.string(),
    voice: joi.allow().empty() || '',
    images: joi.allow().empty() || '',
  });
