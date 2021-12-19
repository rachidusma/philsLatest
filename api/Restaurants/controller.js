import { Category } from '../Category/model'
import { User } from '../Users/model'
import { Dish } from '../Dishes/model'

const { Restaurant, validate } = require('./model')

export const getAllRestaurantsForClient = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).select({ address: 1, email: 1, openTimes: 1, title: 1 })
    res.status(200).json(restaurants)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getUserFav = async (req, res) => {
  try {
    const restaurants = []
    for (let i = 0; i < req.body.userFav.length; i++) {
      const _id = req.body.userFav[i]
      const restaurant = await Restaurant.findById(_id).select({ address: 1, email: 1, openTimes: 1, title: 1, img: 1 })
      if (restaurant) { restaurants.push(restaurant) }
    }
    res.status(200).json(restaurants)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).populate({
      path: 'owner',
      select: 'name'
    })
    res.status(200).json(restaurants)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const addRestaurant = async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error) { return res.status(400).send({ msg: error.details[0].message }) }
    const restarant = await Restaurant.create(req.body)
    res.status(200).json(restarant)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getOneRestaurantForClient = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ title: req.params.title })
    const allCategories = await Category.find({ restaurant: restaurant._id })
    const categories = []
    for (let i = 0; i < allCategories.length; i++) {
      const category = JSON.parse(JSON.stringify(allCategories[i]))
      category.dishes = await Dish.find({ category: category._id })
      categories.push(category)
    }

    const rre = JSON.parse(JSON.stringify(restaurant))

    rre.categories = categories.filter(cate => cate.dishes.length > 0)
    res.status(200).json(rre)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getOneRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate({ path: 'owner', select: 'name' })
    res.status(200).json(restaurant)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const editRestaurant = async (req, res) => {
  await Restaurant.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, restaurant) => {
    if (err) { res.status(400).json({ msg: err.message }) }
    res.status(200).json(restaurant)
  })
}

export const deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findOneAndDelete({ _id: req.params.id })
    res.status(200).json({ msg: 'Deleted Successfully' })
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const changeRestaurantOwner = async (req, res) => {
  try {
    const { newUserId, restaurantId } = req.body
    const restaurant = await Restaurant.findById(restaurantId)
    const oldUser = await User.findById(restaurant.owner)
    const newUser = await User.findById(newUserId)
    const oldUserRestIdx = oldUser.restaurantId.findIndex(restId => restId === restaurantId)
    oldUser.restaurantId.splice(oldUserRestIdx, 1)
    newUser.restaurantId.push(restaurantId)
    restaurant.owner = newUserId
    await restaurant.save()
    await oldUser.save()
    await newUser.save()
    res.status(200).json({ msg: 'Updated Successfully' })
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
