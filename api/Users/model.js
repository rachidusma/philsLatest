const mongoose = require('mongoose')

const Joi = require('joi')

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sendMails: {
    type: Boolean,
    required: true
  },
  agreeToTerms: {
    type: Boolean,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  postcode: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  fav: {
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'dishes' }
    ],
    default: []
  },
  orders: {
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'orders' }
    ],
    default: []
  },
  restaurantId: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' }],
    default: []
  },
  role: {
    type: String,
    required: true,
    default: 'client'
  }
},
{ timestamps: true })

const User = mongoose.model('users', Schema)

function validate (user) {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string(),
    restaurantId: Joi.array(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.string(),
    postcode: Joi.string(),
    location: Joi.string(),
    sendMails: Joi.boolean().required(),
    agreeToTerms: Joi.boolean().required()
  })

  return userSchema.validate(user, { abortEarly: false })
};

module.exports.userSchema = Schema
module.exports.User = User
module.exports.validate = validate
