
<template>
  <b-modal
    v-model="dishModalOpen"
    trap-focus
    :destroy-on-hide="true"
    aria-role="dialog"
    aria-label="Checkout Order"
    aria-modal
    @close="$emit('close')"
  >
    <template #default>
      <section style="width: 100%" class="dish-model card p-5">
        <div
          class="
            mb-3
            is-flex is-justify-content-space-between is-align-items-center
          "
        >
          <h3 class="is-size-5 has-text-weight-bold mb-3">Your Order</h3>
          <b-button type="is-light" size="is-small" @click="$emit('close')">
            <i class="ri-close-line" />
          </b-button>
        </div>
        <div v-for="(dish, idx) in cart" :key="dish._id">
          <cart-dish :dish="dish" :idx="idx" />
        </div>

        <hr />

        <div
          class="is-flex is-justify-content-space-between is-align-items-center"
        >
          <p class="has-text-weight-bold">Total</p>
          <p class="has-text-weight-bold">{{ totalPrice }} kr</p>
        </div>
        <b-button
          expanded
          :loading="disabledCheckoutBtn"
          class="mt-4"
          tag="a"
          :href="link()"
          type="is-primary"
        >
          Checkout
        </b-button>
      </section>
    </template>
  </b-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CartDish from './CartDish.vue'
export default {
  components: { CartDish },
  props: {
    isOpen: {
      type: Boolean,
      default: () => true
    },
    restaurantId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      dishModalOpen: false,
      disabledCheckoutBtn: false
    }
  },
  computed: {
    ...mapGetters({
      cart: 'localStorage/cart',
      totalPrice: 'localStorage/totalPrice'
    })
  },
  watch: {
    isOpen(newValue) {
      this.dishModalOpen = newValue
    }
  },
  methods: {
    ...mapActions({
      checkout: 'localStorage/checkout'
    }),
    link() {
      return location.origin + this.localePath('/checkout')
    },
    async doCheckout() {
      this.disabledCheckoutBtn = true
      await this.checkout({ restaurantId: this.restaurantId })
      this.$store.dispatch('notify', {
        $buefy: this.$buefy,
        type: 'success',
        message: 'We got your order!'
      })
    }
  }
}
</script>

<style>
</style>
