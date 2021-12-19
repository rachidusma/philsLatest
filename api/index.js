const express = require('express')
const mongoose = require('mongoose')

const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const logger = require('morgan')
const helmet = require('helmet')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { default: auth } = require('./middlewares/auth')
const { multer, uploadImage } = require('./middlewares/handleImages')

require('dotenv')
// Create express instance
const app = express()

// Middleware
app.use(xss())
app.use(mongoSanitize())
app.use(helmet())
app.use(logger('dev'))
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

// connect to db
async function db () {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
};
db()

// Require API routes
const users = require('./Users/routes')
const restaurants = require('./Restaurants/routes')
const category = require('./Category/routes')
const Dishes = require('./Dishes/routes')
const Stats = require('./Stats/routes')
const Order = require('./Order/routes')

/** Upload Image */
app.post('/image', auth, multer.single('img'), uploadImage)

// Import API Routes
app.use(users)
app.use(restaurants)
app.use(Dishes)
app.use(Stats)
app.use(category)
app.use(Order)

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    customer: req.user,
    description: 'bought orders with our API',
    currency: 'eur',
    payment_method_types: [
      'giropay',
      'eps',
      'p24',
      'sofort',
      'sepa_debit',
      'card',
      'bancontact',
      'ideal'
    ]
  })
  res.send({
    clientSecret: paymentIntent.client_secret
  })
})

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
