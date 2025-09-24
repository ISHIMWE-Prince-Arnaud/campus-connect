const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(24).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  displayName: Joi.string().max(48).allow(''),
  gender: Joi.string().valid('male', 'female', 'other').default('other'),
  avatarUrl: Joi.string().uri().allow('')
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  mediaUrl: Joi.string().uri().allow('')
});

const reactSchema = Joi.object({
  type: Joi.string().valid('like','laugh','fire','relatable').required()
});

const reportSchema = Joi.object({
  reason: Joi.string().min(3).max(200).required()
});

const submitSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  mediaUrl: Joi.string().uri().allow('')
});

const voteSchema = Joi.object({
  submissionId: Joi.string().required()
});

const messageSchema = Joi.object({
  text: Joi.string().min(1).max(500).required(),
  mediaUrl: Joi.string().uri().allow('')
});

module.exports = {
  registerSchema,
  loginSchema,
  createPostSchema,
  reactSchema,
  reportSchema,
  submitSchema,
  voteSchema,
  messageSchema
};


