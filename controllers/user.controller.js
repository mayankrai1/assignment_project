const helper = require('../utils/helper');
const Joi = require('joi');


const userSchema = Joi.object({
  email: Joi.string().optional().allow(''),
  name: Joi.string().optional().allow(''),
  username: Joi.string().optional().allow(''),
  password: Joi.string().optional().allow(''),
  Permission: Joi.string().optional().allow(''),
  type: Joi.number().optional().allow(''),
  phone: Joi.number().optional().allow(''),
  dob: Joi.date().optional().allow(''),
})

const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  username: Joi.string().required()
  // username: Joi.string().email().required()
})

module.exports = {
  verifyCreate: verifyCreate,
  insert,

  verifyLogin: verifyLogin,
}

function insert(user) { return helper.validator(user, userSchema) }
function verifyLogin(user) { return helper.validator(user, userLoginSchema) }
function verifyCreate(user) { return helper.validator(user, userSchema) }