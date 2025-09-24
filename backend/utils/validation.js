import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(24).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  displayName: Joi.string().max(48).allow(''),
  gender: Joi.string().valid('male', 'female', 'other').default('other'),
  avatarUrl: Joi.string().uri().allow('')
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  mediaUrl: Joi.string().uri().allow('')
});

export const reactSchema = Joi.object({
  type: Joi.string().valid('like','laugh','fire','relatable').required()
});

export const reportSchema = Joi.object({
  reason: Joi.string().min(3).max(200).required()
});

export const submitSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  mediaUrl: Joi.string().uri().allow('')
});

export const voteSchema = Joi.object({
  submissionId: Joi.string().required()
});

export const messageSchema = Joi.object({
  text: Joi.string().min(1).max(500).required(),
  mediaUrl: Joi.string().uri().allow('')
});


