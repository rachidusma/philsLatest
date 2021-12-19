<template>
  <div>
    <div class="container">
      <div class="card my-4">
        <div class="card-header">
          <p class="card-header-title">
            <span class="step">1</span>
            Contact information
          </p>
        </div>

        <div class="card-content">
          <b-field
            :message="$v.name.$error ? $t('validations.required') : ''"
            :type="$v.name.$error ? 'is-danger' : ''"
            :label="$t('inputs.name.label')"
          >
            <b-input
              v-model="name"
              :placeholder="$t('inputs.name.placeholder')"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="name = ''"
            />
          </b-field>

          <b-field
            :message="$v.phone.numeric && $v.phone.$error
              ? $t('validations.onlyNums')
              : $v.phone.required && $v.phone.$error
                ? $t('validations.required')
                : ''"
            :type="$v.phone.$error ? 'is-danger' : ''"
            :label="$t('inputs.Phone number')"
          >
            <b-input
              v-model="phone"
              placeholder="467XXXXXXXX"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="phone = ''"
            />
          </b-field>

          <b-field
            :message="
              $v.email.email && $v.email.$error
                ? $t('validations.validEmail')
                : $v.email.required && $v.email.$error
                  ? $t('validations.required')
                  : ''
            "
            :type="$v.email.$error ? 'is-danger' : ''"
            :label="$t('inputs.email')"
          >
            <b-input
              v-model="email"
              type="text"
              maxlength="30"
              :placeholder="$t('inputs.email')"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="email = ''"
            />
          </b-field>
        </div>
      </div>

      <!-- Payment -->
      <div class="card my-4">
        <div class="card-header">
          <p class="card-header-title">
            <span class="step">2</span>
            Payment method
          </p>
        </div>

        <div class="card-content">
          <div class="columns is-multiline">
            <div class="column is-6-desktop" @click="paymentMethod = 'swish'">
              <div class="payment-method" :class="{ 'active': paymentMethod === 'swish' }">
                <img src="@/assets/swish.png" alt="Swish">
                <b>Swish</b>
              </div>
            </div>
            <div class="column is-6-desktop" @click="paymentMethod = 'card'">
              <div class="payment-method" :class="{ 'active': paymentMethod === 'card' }">
                <img src="@/assets/card.png" alt="card">
                <b>Card</b>
              </div>
            </div>

            <div class="column is-12">
              <div class="payment-inputs">
                <div v-if="paymentMethod === 'card'" class="stripe">
                  <form id="payment-form" name="payment-form" @submit.prevent="handleSubmit">
                    <div id="payment-element">
                      <!--Stripe.js injects the Payment Element-->
                    </div>

                    <button v-show="false" id="submit">
                      <div id="spinner" class="spinner hidden" />

                      <span id="button-text">Pay now</span>
                    </button>

                    <div id="payment-message" class="hidden" />
                  </form>
                </div>
                <!-- End Stripe -->
                <div v-else class="swish">
                  <b-field
                    :message="$v.siwshNumber.numeric && $v.siwshNumber.$error
                      ? $t('validations.onlyNums')
                      : $v.siwshNumber.required && $v.siwshNumber.$error
                        ? $t('validations.required')
                        : ''"
                    :type="$v.siwshNumber.$error ? 'is-danger' : ''"
                    :label="$t('inputs.Phone number')"
                  >
                    <b-input
                      v-model="siwshNumber"
                      placeholder="467XXXXXXXX"
                      icon-right="close-circle"
                      icon-right-clickable
                      @icon-right-click="siwshNumber = ''"
                    />
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- message to restaurant -->
      <div class="card my-4">
        <div class="card-header">
          <p class="card-header-title">
            <span class="step">3</span>
            Message to restaurant
          </p>
        </div>

        <div class="card-content">
          <b-field
            :message="$v.message.$error ? $t('validations.required') : ''"
            :type="$v.message.$error ? 'is-danger' : ''"
            :label="$t('inputs.name.label')"
          >
            <b-input
              v-model="message"
              :placeholder="$t('inputs.name.placeholder')"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="message = ''"
            />
          </b-field>
        </div>
      </div>
      <!-- Your Order -->
      <div class="card my-4">
        <div class="card-header">
          <p class="card-header-title">
            <span class="step">4</span>
            {{ $t('orderPage.yourOrder') }}
          </p>
        </div>

        <div class="card-content">
          <div v-for="(dish, idx) in cart" :key="dish._id">
            <cart-dish :dish="dish" :idx="idx" />
          </div>

          <hr>

          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <p class="has-text-weight-bold">
              {{ $t('stat.total') }}
            </p>
            <p class="has-text-weight-bold">
              {{ totalPrice }} kr
            </p>
          </div>
          <b-button expanded :loading="disabledCheckoutBtn" class="mt-4" type="is-primary" @click="pay">
            {{ $t('stat.checkout') }}
          </b-button>
        </div>
      </div>
    </div>
    <b-loading v-model="isLoading" is-full-page :can-cancel="false">
      <p>{{ loadingMsg }}</p>
    </b-loading>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email, numeric } from 'vuelidate/lib/validators'
import CartDish from '~/components/client/SingleRestaurant/CartDish.vue'

let elements
export default {
  components: { CartDish },
  mixins: [validationMixin],
  data () {
    return {
      formBtnLoading: false,
      paymentMethod: 'swish',
      isLoading: false,
      stripe: null,
      message: '',
      siwshNumber: '',
      loadingMsg: '',
      disabledCheckoutBtn: false,
      name: '',
      phone: '',
      email: ''
    }
  },
  head () {
    return {
      title: 'Checkout',
      script: [
        { src: 'https://js.stripe.com/v3/' }
      ]
    }
  },
  validations: {
    name: { required },
    phone: { required, numeric },
    siwshNumber: { numeric },
    message: { required },
    email: { required, email }
  },
  computed: {
    ...mapGetters({
      cart: 'localStorage/cart',
      totalPrice: 'localStorage/totalPrice'
    })
  },
  watch: {
    paymentMethod (val) {
      if (val && val === 'card') {
        this.$nextTick(async () => {
          await this.initialize()
          await this.checkStatus()
        })
      }
      this.isLoading = false
    }
  },
  beforeMount () {
    // eslint-disable-next-line no-undef
    this.stripe = Stripe(process.env.stripePublicKey)
  },
  methods: {
    ...mapActions({
      checkout: 'localStorage/checkout'
    }),
    updateUserInfo () {
      this.formBtnLoading = true
      this.phone = this.phone.replace('+', '')
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.formBtnLoading = false
        // return
      }
    },
    async initialize () {
      // TODO: Get total from Strore
      const response = await this.$axios.$post('/create-payment-intent', { amount: this.totalPrice }, {
        headers: { 'Content-Type': 'application/json' }
      })
      const { clientSecret } = response
      const appearance = {
        theme: 'stripe'
      }
      // eslint-disable-next-line no-undef
      elements = this.stripe.elements({ appearance, clientSecret })
      const paymentElement = elements.create('payment')
      paymentElement.mount('#payment-element')
      this.isLoading = false
    },
    async  handleSubmit (e) {
      this.disabledCheckoutBtn = true
      e.preventDefault()
      this.loadingMsg = 'Preparing payment form ..'
      this.isLoading = true
      const { error } = await this.stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: 'http://localhost:3000/'
        }
      })
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === 'card_error' || error.type === 'validation_error') {
        alert(error.message)
      } else {
        alert('An unexpected error occured.')
      }
    },
    // Fetches the payment intent status after payment submission
    async checkStatus () {
      const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      )
      if (!clientSecret) {
        return
      }

      const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret)
      switch (paymentIntent.status) {
        case 'succeeded':
          alert('Payment succeeded!')
          break
        case 'processing':
          alert('Your payment is processing.')
          break
        case 'requires_payment_method':
          alert('Your payment was not successful, please try again.')
          break
        default:
          alert('Something went wrong.')
          break
      }
    },
    pay () {
      this.isLoading = true
      if (this.paymentMethod === 'card') {
        this.loadingMsg = 'Processing...'
        document.getElementById('submit').click()
      } else {
        // TODO: Add Swish Method here
      }
      this.isLoading = false
    }
  }
}
</script>

<style>
span.step {
  height: 30px;
  width: 30px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  background-color: rgb(226, 232, 240);
  color: rgb(26, 32, 44);
}

.payment-method {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-method.active {
  border-color: gold;
}

.payment-method img {
  width: 100px;
}
</style>
