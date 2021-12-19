const { Dish, validate } = require('./model')

export const getDishesForRestaurant = async (req, res) => {
  try {
    const categories = await Dish.find({ restaurant: req.user.restaurantId })
    res.status(200).json(categories)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getAllDishs = async (req, res) => {
  try {
    const dishes = await Dish.find({})
      .populate({
        path: 'category',
        select: 'title restaurant',
        populate: {
          path: 'restaurant',
          model: 'restaurants',
          select: 'title'
        }
      })
    res.status(200).json(dishes)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const dishesInCategory = async (req, res) => {
  try {
    const dishes = await Dish.find({ category: req.params.cateId })
    res.status(200).json(dishes)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const addDish = async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error) { return res.status(400).send({ msg: error.details[0].message }) }
    const dish = await Dish.create(req.body)
    res.status(200).json({ msg: 'Created Successfully', id: dish._id })
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getOneDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
    res.status(200).json(dish)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const editDish = async (req, res) => {
  await Dish.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, dish) => {
    if (err) { res.status(400).json({ msg: err.message }) }
    res.status(200).json(dish)
  })
}

export const deleteDish = async (req, res) => {
  try {
    await Dish.findOneAndDelete({ _id: req.params.id })
    res.status(200).json({ msg: 'Deleted Successfully' })
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
