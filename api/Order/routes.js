const { Router } = require('express')
const { default: auth, clientAuth } = require('../middlewares/auth')

const {
  getAllOrders,
  addOrder,
  getOneOrder,
  changeOrderState,
  getOrdersForRestaurant
} = require('./controller')

const router = Router()
router
  .route('/orders')
  .get(auth, getAllOrders)
  .post(clientAuth, addOrder)

router.get('/orders/:id', clientAuth, getOneOrder)
router.get('/orders/filter/:id', auth, getOrdersForRestaurant)
router.post('/orders/changeState/:id', auth, changeOrderState)
module.exports = router
