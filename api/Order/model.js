const mongoose = require('mongoose')
const Joi = require('joi')

const Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  delivery: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurants',
    required: true
  },
  orderState: {
    type: String,
    default: 'placed'
  }
},
{ timestamps: true })

const Order = mongoose.model('orders', Schema)

function validate (order) {
  const orderSchema = Joi.object({
    user: Joi.string().required(),
    items: Joi.array().min(1).required(),
    total: Joi.number().required(),
    delivery: Joi.string().required(),
    date: Joi.date().required(),
    restaurant: Joi.string().required(),
    orderState: Joi.string()
  })

  return orderSchema.validate(order, { abortEarly: false })
};

module.exports.orderSchema = Schema
module.exports.Order = Order
module.exports.validate = validate
