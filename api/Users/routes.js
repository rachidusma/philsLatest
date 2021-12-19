const { Router } = require('express')
const { default: auth, clientAuth } = require('../middlewares/auth')

const {
  getUser,
  authenticate,
  addUser,
  getAllUsers,
  addProductToFav,
  deleteUser,
  getOneUser,
  updateUser
} = require('./controller')

const router = Router()

router.get('/users/', auth, getAllUsers)

router.get('/users/one/:id', auth, getOneUser)
router.patch('/users/:id', clientAuth, updateUser)
router.delete('/users/:id', auth, deleteUser)
router.post('/users/', addUser)

router.post('/users/fav/:id', clientAuth, addProductToFav)

// For Authentication
router.get('/users/me', clientAuth, getUser)
router.post('/users/auth', authenticate)

module.exports = router
