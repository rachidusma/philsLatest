const { Router } = require('express')
const { default: auth, clientAuth } = require('../middlewares/auth')

const {
  getAllDishs,
  addDish,
  dishesInCategory,
  getOneDish,
  getDishesForRestaurant,
  editDish,
  deleteDish
} = require('./controller')

const router = Router()

router
  .route('/dishes')
  .get(clientAuth, getAllDishs)
  .post(auth, addDish)

router.get('/dishes/with-cate/:cateId', auth, dishesInCategory)
router.get('/dishes/:id', clientAuth, getOneDish)
router.patch('/dishes/:id', auth, editDish)
router.delete('/dishes/:id', auth, deleteDish)

router.get('/dishes/filter/:restaurantId', auth, getDishesForRestaurant)
module.exports = router
