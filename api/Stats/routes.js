const { Router } = require('express')
const { Types } = require('mongoose')
const { default: AdminAuth } = require('../middlewares/auth')
const { Restaurant } = require('../Restaurants/model')
const { Dish } = require('../Dishes/model')
const { Category } = require('../Category/model')
const { Order } = require('../Order/model')
const { User } = require('../Users/model')

const router = Router()

router.get('/stats/dashboard/restaurants', AdminAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const restauratnWithCates = await Restaurant.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: 'restaurant',
            as: 'cate'
          }
        }
      ])
      res.status(200).json(restauratnWithCates)
    } else if (req.user.role === 'Restaurant Owner') {
      const restauratnWithCates = await Restaurant.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(req.user.restaurantId)
          }
        }, {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: 'restaurant',
            as: 'cate'
          }
        }
      ])
      res.status(200).json(restauratnWithCates)
    }
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
})

router.get('/stats/dashboard/overview', AdminAuth, async (req, res) => {
  try {
    const restaurans = await Restaurant.countDocuments()
    const dishes = await Dish.countDocuments()
    const categories = await Category.countDocuments()
    const orders = await Order.countDocuments()
    const admins = await User.find({ role: 'admin' }).countDocuments()
    const owners = await User.find({ role: 'Restaurant Owner' }).countDocuments()
    const clients = await User.find({ role: 'client' }).countDocuments()

    return res.status(200).json({ restaurans, dishes, categories, orders, admins, owners, clients })
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
})

module.exports = router
