<template>
  <div class="fav column is-two-fifth is-hidden-touch">
    <div class="is-flex is-justify-content-space-between">
      <p>
        {{
          cart.length > 0 ?
            $t('orderPage.yourOrder') :
            $t('orderPage.cartEmpty')
        }}
      </p>
      <div>
        <fav-btn :restaurant-id="restaurantId" />
        <b-button type="is-light" icon-right="calendar" @click="$emit('openCartModal')" />
      </div>
    </div>
    <!-- End header -->
    <div>
      <span>
        <i class="ri-shopping-cart-2-fill" />
        {{ orderInfo.delivery }}
      </span>
      <span>
        <i class="ri-time-line" />
        {{ orderInfo.date }} - {{ orderInfo.time }}
      </span>
    </div>
    <!-- End details -->
    <hr>

    <div class="cart-items my-4">
      <div v-for="(dish, idx) in cart" :key="dish._id">
        <cart-dish :dish="dish" :idx="idx" />
      </div>
      <b-button
        v-if="cart.length > 0"
        :disabled="!valid"
        expanded
        class="mt-4"
        type="is-primary"
        @click="doCheckout"
      >
        {{ $t('stat.checkout') }}
      </b-button>
    </div>

    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <p class="has-text-weight-bold">
        {{ $t('stat.total') }}
      </p>
      <p class="has-text-weight-bold">
        {{ totalPrice }} kr
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CartDish from './CartDish.vue'
import FavBtn from '~/components/utils/FavBtn.vue'

export default {
  components: {
    CartDish,
    FavBtn
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => {
        return {
          date: 'Today',
          time: 'ASAP',
          delivery: 'Take away'
        }
      }
    },
    restaurantId: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      disabledCheckoutBtn: false
    }
  },
  computed: {
    ...mapGetters({
      cart: 'localStorage/cart',
      totalPrice: 'localStorage/totalPrice'
    }),
    valid () {
      return (
        this.orderInfo.date &&
        this.orderInfo.time &&
        this.orderInfo.delivery &&
        this.cart.length > 0 &&
        this.totalPrice > 0
      )
    }
  },
  methods: {
    doCheckout () {
      if (!this.$auth.loggedIn) {
        this.$store.commit('sideBarState')
      } else {
        this.$emit('checkout')
      }
    }
  }
}
</script>

<style>

.fav {
  position: sticky;
  padding-right: 3rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  height: max-content;
  z-index: 0;
  top: 15%;

  margin-top: 10px;
  background: #fff;
  box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px,
    rgb(0 0 0 / 4%) 0px 10px 10px -5px;
  border-radius: 0.25rem;
  max-height: 40rem;
}
</style>
