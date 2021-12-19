const mongoose = require('mongoose')
const Joi = require('joi')

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  openTimes: {
    type: [{
      day: String,
      times: [Date]
    }],
    required: true
  }
},
{ timestamps: true })

const Restaurant = mongoose.model('restaurants', Schema)

function validate (restaurant) {
  const restaurantSchema = Joi.object({
    email: Joi.string().required(),
    owner: Joi.string().required(),
    img: Joi.string().required(),
    title: Joi.string().required(),
    address: Joi.string().required(),
    categories: Joi.array(),
    openTimes: Joi.array().required()
  })

  return restaurantSchema.validate(restaurant, { abortEarly: false })
};

module.exports.restaurantSchema = Schema
module.exports.Restaurant = Restaurant
module.exports.validate = validate
