<template>
  <b-modal
    v-model="dishModalOpen"
    trap-focus
    :destroy-on-hide="true"
    aria-role="dialog"
    aria-label="Dish Modal"
    aria-modal
    @close="reset"
  >
    <template #default>
      <section v-if="dish" style="width: 100%" class="dish-model card p-5">
        <div class="dish-modal-header">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <h3 class="is-size-5 has-text-weight-bold mb-3">
              {{ dish.title }}
            </h3>
            <b-button type="is-light" size="is-small" @click="reset">
              <i class="ri-close-line" />
            </b-button>
          </div>
        </div>
        <div class="mb-3 has-text-centered">
          <img :src="dish.img" :alt="dish.title">
        </div>
        <p class="is-size-6">
          {{ dish.title }}
        </p>
        <dish-flavours :flavours="dish.flavours" @flavourPriceChanged="flavourPrice = $event.totalPrice; flavour = $event.flavours" />
        <dish-addons :dish-title="dish.title" :addons="dish.addons" @addonsPriceChanged="addonsPrice = $event.price; addons = $event.addons" />

        <div class="dish-modal-footer is-flex">
          <b-numberinput v-model="dishesNum" min="0" type="is-light" />

          <div class="is-flex-grow-1">
            <b-button :disabled="orderPrice === 0" class="mb-3" type="is-success" expanded @click="addToCart">
              {{ orderPrice }} kr {{ $t('orderPage.addToCart') }}
            </b-button>
          </div>
        </div>
      </section>
    </template>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DishAddons from './DishAddons.vue'
import DishFlavours from './DishFlavours.vue'
export default {
  name: 'DishModal',
  components: { DishAddons, DishFlavours },
  props: {
    isOpen: {
      type: Boolean,
      default: () => true
    },
    dish: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      dishModalOpen: false,
      flavour: '',
      flavourPrice: 0,
      addons: [],
      addonsPrice: 0,
      dishesNum: 1
    }
  },
  computed: {
    ...mapGetters({
      cart: 'localStorage/cart'
    }),
    dishInStorage () {
      return this.dish ? this.cart.find(dish => dish._id === this.dish._id) : null
    },
    orderPrice () {
      return this.dishesNum * (this.dish.from + this.flavourPrice + this.addonsPrice)
    }
  },
  watch: {
    isOpen (newValue) {
      this.dishModalOpen = newValue
    }
  },
  methods: {
    ...mapActions({
      editCart: 'localStorage/editCart'
    }),
    reset () {
      this.flavourPrice = 0
      this.addonsPrice = 0
      this.dishesNum = 1
      this.$emit('closed')
    },
    addToCart () {
      const vm = this
      const dish = {
        _id: vm.dish._id,
        dish: vm.dish.title,
        price: vm.dish.from,
        flavour: {
          title: vm.flavour,
          price: vm.flavourPrice
        },
        addons: {
          items: vm.addons,
          price: vm.addonsPrice
        },
        amount: vm.dishesNum,
        total: vm.orderPrice
      }
      this.editCart({ type: 'add', item: dish, idx: 0 })
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>
.dish-model {
  position: relative;
}

.dish-modal-header {
  padding: 10px;
  background: white;
  z-index: 99;
  position: sticky;
  top: 0;
  width: 100%;
  left: 0;
}

.dish-model img {
  max-width: 200px;
}

.dish-modal-footer {
  position: sticky;
  bottom: 0;
  z-index: 99;
  background: white;
  width: 100%;
  left: 0;
}
</style>
