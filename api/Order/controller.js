const { Order, validate } = require('./model')
/**
 * @desc If there was a user=true query will filter with user id. If not will filter with restaurant.
 */
export const getOrdersForRestaurant = async (req, res) => {
  try {
    const { user } = req.query
    const query = user ? { user: req.params.id } : { restaurant: req.params.id }
    const categories = await Order.find(query).populate({ path: 'user', select: 'name location phone email' })

    res.status(200).json(categories)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order
      .find({})
      .populate({ path: 'restaurant', select: 'title' })
      .populate({ path: 'user', select: 'name' })
    res.status(200).json(orders)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const addOrder = async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error) { return res.status(400).send({ msg: error.details[0].message }) }
    await Order.create(req.body)
    res.status(200).json({ msg: 'Created Successfully' })
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const getOneOrder = async (req, res) => {
  try {
    const order = await Order
      .findById(req.params.id)
      .populate({ path: 'restaurant', select: 'title' })
      .populate({ path: 'user', select: 'name' })
    res.status(200).json(order)
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}

export const changeOrderState = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    order.orderState = req.body.orderState
    await order.save()
    res.status(200).json({ msg: 'Edited successfully' })
  } catch (err) {
    res.status(400).json({ msg: err.message })
  }
}
