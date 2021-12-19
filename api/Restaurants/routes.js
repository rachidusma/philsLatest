const { Router } = require('express')
const { default: auth, clientAuth } = require('../middlewares/auth')

const {
  getAllRestaurants,
  getAllRestaurantsForClient,
  getOneRestaurantForClient,
  addRestaurant,
  getOneRestaurant,
  editRestaurant,
  getUserFav,
  changeRestaurantOwner,
  deleteRestaurant
} = require('./controller')

const router = Router()

router
  .route('/restaurants')
  .get(auth, getAllRestaurants)
  .post(auth, addRestaurant)

router
  .route('/restaurants/:id')
  .get(clientAuth, getOneRestaurant)
  .patch(auth, editRestaurant)
  .delete(auth, deleteRestaurant)

router.post('/restaurants/change/restAdmin', changeRestaurantOwner)
router.post('/restaurants/client/getUserFav', clientAuth, getUserFav)
router.get('/restaurants/client/all', getAllRestaurantsForClient)
router.get('/restaurants/client/one/:title', getOneRestaurantForClient)
module.exports = router
