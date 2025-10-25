import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  deviceId: Joi.string().required(),
  pushToken: Joi.string().optional(), // Optional for backward compatibility
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().required(),
  pushToken: Joi.string().optional(), // Optional for backward compatibility
});
