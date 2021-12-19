<template>
  <div>
    <restaurantInfoSection :info="info" :restaurant-id="restaurantId" :open-times="openTimes" :today="today" />
    <section class="recipes">
      <page-header
        :types="types"
        @toggleState="types[$event].isOpen = !types[$event].isOpen"
      />

      <div class="container mt-4" style="overflow: hidden">
        <!-- Start Foods -->
        <main>
          <div class="is-flex is-relative columns">
            <div class="column is-three-fifths-desktop">
              <DishCategoryCollapse
                v-for="(type, idx) in types"
                :key="type.title"
                :state="type.isOpen"
                :title="type.title"
                :dishes="type.dishes"
                @openType="typeOpened(idx)"
                @closeType="type.isOpen = false"
              />
            </div>
            <!-- End Dishes -->
            <cart-card :restaurant-id="restaurantId" :order-info="orderInfo" @checkout="checkoutModalOpen = true" @openCartModal="cartModalOpen = true" />
            <!-- End Cart -->
          </div>
        </main>
        <!-- End Foods -->
      </div>
    </section>

    <cart-order-modal :days="openTimes[today]" :is-open="cartModalOpen" @close="changeOrderInfo($event)" />
    <restaurant-closed-modal :days="openTimes[today]" :restaurant="info" />

    <checkout-modal v-if="cart.length > 0" :restaurant-id="restaurantId" :is-open="checkoutModalOpen" @close="checkoutModalOpen = false" />
    <div class="cart-bottom is-hidden-desktop">
      <div class="cart-bottom__wrapper">
        <div class="is-flex columns">
          <div class="column is-one-fifth">
            <b-button type="is-light is-warning" icon-right="calendar" @click="cartModalOpen = true" />
          </div>
          <div class="column is-three-fifth" @click="checkoutModalOpen = true">
            <b-button :disabled="cart.length === 0" expanded type="is-ghost" class="view-order-button  has-text-centered">
              View Order
            </b-button>
          </div>
          <div class="column is-one-fifth">
            {{ cart.length === 0 ? 0 : ordinal_suffix_of(cart.length) }} | {{ totalPrice }} kr
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
import restaurantInfoSection from '~/components/client/SingleRestaurant/RestaurantDetailCard.vue'
import DishCategoryCollapse from '~/components/client/SingleRestaurant/DishCategoryCollapse.vue'
import PageHeader from '~/components/client/SingleRestaurant/PageHeader.vue'
import CartCard from '~/components/client/SingleRestaurant/CartCard.vue'
import CartOrderModal from '~/components/client/SingleRestaurant/CartOrderModal.vue'
import RestaurantClosedModal from '~/components/client/SingleRestaurant/RestaurantClosedModal.vue'
import CheckoutModal from '~/components/client/SingleRestaurant/CheckoutModal.vue'

const customParseFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(customParseFormat)

export default {
  name: 'SingleRestaurant',

  components: {
    restaurantInfoSection,
    DishCategoryCollapse,
    PageHeader,
    CartCard,
    RestaurantClosedModal,
    CartOrderModal,
    CheckoutModal
  },
  data () {
    return {
      cartModalOpen: false,
      checkoutModalOpen: false,
      today: 0,
      info: {},
      restaurantId: '',
      openTimes: [],
      types: []
    }
  },
  async fetch () {
    try {
      const restaurant = await this.$axios.$get(`${process.env.baseUrl}/api/restaurants/client/one/${this.$route.params.title}`)
      this.restaurantId = restaurant._id
      this.info = {
        email: restaurant.email,
        title: restaurant.title,
        img: restaurant.img,
        address: restaurant.address
      }
      restaurant.categories.forEach((x) => { x.isOpen = false })
      this.types = restaurant.categories
      this.today = dayjs().day()
      restaurant.openTimes.forEach((day) => {
        const open = dayjs(day.times[0]).format('hh:mm')
        const close = dayjs(day.times[1]).format('hh:mm')
        day.times = [open, close]
      })
      this.openTimes = restaurant.openTimes
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err })
      this.$fetch()
    }
  },
  computed: {
    ...mapGetters({
      restaurantName: 'localStorage/restaurantName',
      cart: 'localStorage/cart',
      orderInfo: 'localStorage/orderInfo',
      totalPrice: 'localStorage/totalPrice'
    }),
    lang () {
      return this.$i18n.locale
    }
  },
  watch: {
    lang () {
      this.$fetch()
    }
  },
  mounted () {
    if (this.restaurantName !== this.info.title) {
      this.resetCart()
    }
    this.changeRestaurantName(this.info.title)
  },
  methods: {
    ...mapActions({
      changeRestaurantName: 'localStorage/changeRestaurantName',
      updateOrderInfo: 'localStorage/changeOrderInfo',
      resetCart: 'localStorage/resetCart'
    }),
    ordinal_suffix_of (i) {
      const j = i % 10
      const k = i % 100
      if (j === 1 && k !== 11) {
        return i + 'st'
      }
      if (j === 2 && k !== 12) {
        return i + 'nd'
      }
      if (j === 3 && k !== 13) {
        return i + 'rd'
      }
      return i + 'th'
    },
    typeOpened (typeIdx) {
      this.types[typeIdx].isOpen = true
      this.types.forEach((type, idx) => {
        if (idx !== typeIdx) { type.isOpen = false }
      })
    },
    changeOrderInfo (data) {
      this.cartModalOpen = false
      if (data) {
        const { orderDate, delivery, orderTime } = data
        this.updateOrderInfo({ date: orderDate, delivery, time: orderTime })
      }
    }
  }
}
</script>

<style scoped>

.cart-bottom {
  width: 90%;
  position: fixed;
  bottom: 20px;
  left: 5%;
  z-index: 38;
}

.cart-bottom__wrapper {
  color: white;
  background: #084625;
  border-radius: 10px;
  padding: 10px;
  width: 100%;
}
.cart-bottom__wrapper.disabled {
  background: #084625;
}

.cart-bottom__wrapper .column {
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-order-button {
  color: white;
  text-decoration: none;
}
.view-order-button[disabled] {
  background-color: transparent;
  border-color: transparent;
}

.view-order-button:hover {
  color: white;
  text-decoration: none;
}
</style>
