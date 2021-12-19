<template>
  <div class="dish-card p-2" @click="!closed ? $emit('openModal') : null">
    <!-- <div class="dish-card p-2" @click="(!closed && dish.amount > 0)? $emit('openModal') : null"> -->
    <!-- <div v-if="closed || dish.amount <= 0" class="overlay">
      <p v-if="closed">
        We are Closed
      </p>
      <p v-else-if="dish.amount === 0">
        {{ dish.title }} out of stock
      </p>
    </div> -->
    <div v-if="dish" class="dish-card-wrapper is-flex is-align-items-stretch columns">
      <div class="column is-one-quarter">
        <img :src="dish.img" :alt="dish.title">
      </div>
      <div class="column is-two-quarters">
        <div class="info">
          <div>
            <h3 class="has-text-black has-text-weight-bold">
              {{ dish.title }}
            </h3>
            <p>
              {{ dish.gradients }}
            </p>
          </div>
          <!-- Price -->
        </div>
      </div>
      <div class="column is-flex is-flex-direction-column is-justify-content-space-between  is-one-quarter">
        <div v-if="isInCart(dish._id)" class="how-many">
          {{ cart.find(dishInCart => dishInCart._id === dish._id).amount }}
        </div>
        <div class="dish-card-price">
          <p>{{ $t('orderPage.from') }} {{ dish.from }} kr</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DishCard',
  props: {
    closed: {
      type: Boolean,
      default: () => false
    },
    dish: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    ...mapGetters({
      cart: 'localStorage/cart'
    })
  },
  methods: {
    isInCart (_id) {
      return this.cart.some(dish => dish._id === _id)
    }
  }
}
</script>

<style scoped>
.overlay {
  cursor: not-allowed;
  content: '';
  z-index: 5;
  position: absolute;
  background: rgba(0,0,0,0.7);
  color: white;
  font-weight: bold;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.dish-card {
  position: relative;
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  margin-bottom: 10px;
  transition: transform 0.4s ease-out;
}

.dish-card:hover {
  transform: translate(0, -5px);
  cursor: pointer;
}

.dish-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px,
    rgb(0 0 0 / 4%) 0px 10px 10px -5px;
}

.how-many {
  background-color: rgb(8, 70, 37);
  color: rgb(201, 149, 70);
  padding: 0.5rem 1rem;
  text-align: center;
  align-self: flex-end;
  border-radius: 0px 0.75rem;
}

.dish-card .img {
  width: 100%;
  margin-right: 10px;
}

.dish-card img {
  border-radius: 10px;
  height: 100%;
  object-fit: cover;
}

.dish-card .info p {
  font-size: 14px;
}

.dish-card .dish-card-price p {
  font-weight: 700;
  font-size: 1.2rem;
  padding: 0px 0.5rem 0.5rem 0px;
  text-align: right;
}

</style>
