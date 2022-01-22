import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production'),
  MONGODB_URI: Joi.string().required(),
});
