const joi = require('joi');

const createPostSchema = joi.object({
  description: joi.string(),
  voice: joi.allow().empty() || '',
  images: joi.allow().empty() || '',
});

module.exports = { createPostSchema };
