const mongoose = require('mongoose')
const Joi = require('joi')

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  gradients: {
    type: String,
    required: true
  },
  from: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurants',
    required: true
  },
  flavours: {
    type: [{
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }],
    default: []
  },
  addons: {
    type: [{
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }],
    default: []
  }
},
{ timestamps: true })

const Dish = mongoose.model('dishes', Schema)

function validate (dish) {
  const dishSchema = Joi.object({
    title: Joi.string().required(),
    img: Joi.string().required(),
    restaurant: Joi.string().required(),
    category: Joi.string().required(),
    gradients: Joi.string().required(),
    from: Joi.number().min(0).required(),
    flavours: Joi.array().optional(),
    addons: Joi.array().optional()
  })

  return dishSchema.validate(dish, { abortEarly: false })
};

module.exports.dishSchema = Schema
module.exports.Dish = Dish
module.exports.validate = validate
