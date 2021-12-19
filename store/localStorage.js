// import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  cart: [],
  restaurantName: '',
  orderInfo: {},
  totalPrice: 0
})

export const mutations = {
  restaurantName (state, name) {
    state.restaurantName = name
  },
  addToCart (state, item) {
    state.cart.push(item)
    state.totalPrice += item.total
  },
  deleteFromCart (state, idx) {
    const item = state.cart[idx]
    state.totalPrice -= item.total
    state.cart.splice(idx, 1)
  },
  changeDishAmount (state, { newAmount, dishIdx }) {
    // Get dish from cart
    const dish = state.cart[dishIdx]
    // delete it from totalPrice
    state.totalPrice -= dish.total
    // Update dish total and amount
    const newTotal = Number(newAmount) * (dish.price + dish.flavour.price + dish.addons.price)
    dish.total = newTotal
    dish.amount = newAmount
    // update total price with new total dish price
    state.totalPrice += newTotal
  },
  checkoutCart (state) {
    state.cart = []
    state.totalPrice = 0
  },
  orderInfo (state, info) {
    state.orderInfo = info
  },
  resetCart (state) {
    state.cart = []
    state.orderInfo = {}
    state.totalPrice = 0
  }
}

export const actions = {
  changeRestaurantName ({ commit }, name) {
    commit('restaurantName', name)
  },
  editCart ({ commit }, { type, item, idx }) {
    switch (type) {
      case 'add':
        commit('addToCart', item)
        break
      case 'remove':
        commit('deleteFromCart', idx)
    }
  },
  changeDishAmount ({ commit }, { newAmount, dishIdx }) {
    commit('changeDishAmount', { newAmount, dishIdx })
  },
  changeOrderInfo ({ commit }, orderInfo) {
    commit('orderInfo', orderInfo)
  },
  resetCart ({ commit }) {
    commit('resetCart')
  },
  async checkout ({ commit, state }, { restaurantId }) {
    const order = {
      user: this.$auth.user._id,
      items: state.cart,
      total: state.totalPrice,
      date: new Date(`${state.orderInfo.date} ${state.orderInfo.time}`),
      delivery: state.orderInfo.delivery,
      restaurant: restaurantId
    }
    try {
      await this.$axios.$post('/orders/', order)
      commit('checkoutCart')
    } catch (err) {
      console.log(err)
    }
  }
}

export const getters = {
  restaurantName (state) {
    return state.restaurantName
  },
  cart (state) {
    return state.cart
  },
  orderInfo (state) {
    return state.orderInfo
  },
  totalPrice (state) {
    return state.totalPrice
  }
}
