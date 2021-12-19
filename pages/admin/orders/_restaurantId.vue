<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Orders:</h3>

      <div class="filters m-3">
        <b-button rounded :type="filter === 'placed' ? 'is-primary' : 'is-primary is-light'" @click="filter = 'placed'">
          Placed
        </b-button>
        <b-button rounded :type="filter === 'review' ? 'is-primary' : 'is-primary is-light'" @click="filter = 'review'">
          In Review
        </b-button>
        <b-button rounded :type="filter === 'delivered' ? 'is-primary' : 'is-primary is-light'" @click="filter = 'delivered'">
          Delivered
        </b-button>
        <b-button rounded :type="filter === 'canceled' ? 'is-primary' : 'is-primary is-light'" @click="filter = 'canceled'">
          Canceled
        </b-button>
      </div>
      <b-collapse
        v-for="(order, index) in displayedOrders"
        :key="order.title+index"
        class="card"
        animation="slide"
        aria-id="contentIdForA11y3"
      >
        <template #trigger="props">
          <header class="card-header">
            <div v-if="order.date" class="card-header-title is-flex is-justify-content-space-between is-align-items-center">
              <p class="my-0 is-size-5">
                Date: {{ $dayjs(order.date).format('YYYY/MM/DD HH:MM') }}, state: {{ order.orderState }}
              </p>
              <h3 class="my-0 is-size-5">
                Total: {{ order.total }} Kr
                <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'"
                />
              </h3>
            </div>
          </header>
        </template>

        <div class="card-content">
          <ul>
            <li class="mb-3">
              <p class="m-0 p-0">
                User Info:
              </p>
              <p class="m-0 p-0">
                name: {{ order.user.name }}
              </p>
              <p class="m-0 p-0">
                Location: {{ order.user.location || 'Not provided' }}
              </p>
              <p class="m-0 p-0">
                phone: {{ order.user.phone }}
              </p>
              <p class="m-0 p-0">
                email: {{ order.user.email }}
              </p>
            </li>
            <li class="mb-3">
              Order created At: {{ $dayjs(order.date).format('YYYY/MM/DD HH:MM') }}
            </li>
            <li>
              <p>Place {{ order.delivery }}</p>
            </li>
            <li class="mb-3">
              <p>State:</p>
              <b-select :value="order.orderState" @input="changeOrderState($event,index)">
                <option value="placed">
                  Placed
                </option>
                <option value="review">
                  In Review
                </option>
                <option value="delivered">
                  Delivered
                </option>
                <option value="canceled">
                  Canceled
                </option>
              </b-select>
            </li>
            <li class="mb-3">
              <p>Items:</p>
              <div v-for="item in order.items" :key="item._id" class="is-bordered order-item">
                <header class="is-flex is-justify-content-space-between is-align-items-center">
                  <h3 class="is-size-5">
                    {{ item.amount }} X {{ item.dish }}
                  </h3>

                  <h3 class="is-size-5">
                    {{ item.price }} Kr
                  </h3>
                </header>

                <div class="order-item__content">
                  <!-- Flavours -->
                  <details open>
                    <summary>
                      <span class="is-size-5">
                        <b>Flavour: </b>
                      </span>
                    </summary>
                    <div class="mt-3 is-flex is-justify-content-space-between is-align-items-center">
                      <p class="has-text-weight-bold">
                        {{ item.flavour.title.title }}
                      </p>
                      <p class="has-text-weight-bold">
                        {{ item.flavour.title.price }} Kr
                      </p>
                    </div>
                  </details>
                  <!-- Addons -->
                  <details open>
                    <summary>
                      <span class="is-size-5">
                        <b>Addons: </b>
                      </span>
                    </summary>
                    <div v-for="addon in item.addons.items" :key="addon._id" class="mt-3 is-flex is-justify-content-space-between is-align-items-center">
                      <p class="has-text-weight-bold">
                        {{ addon.amount }} X {{ addon.title }}
                      </p>
                      <p class="has-text-weight-bold">
                        {{ addon.amount }} X {{ addon.price }} = {{ addon.price * addon.amount }} Kr
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </b-collapse>

      <p v-if="displayedOrders.length === 0" class="mt-4 has-text-black has-text-weight-bold has-text-centered">
        There is no orders with this state
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'RestaurantOrderPage',
  layout: 'admin',
  middleware: 'admins',
  data () {
    return {
      orders: [],
      filter: 'placed',
      err: null
    }
  },
  async fetch () {
    try {
      const orders = await this.$axios.$get(`${process.env.baseUrl}/api/orders/filter/${this.$route.params.restaurantId}`)
      this.orders = orders
      this.$store.dispatch('toast', { $buefy: this.$buefy, type: 'success', message: 'Data fetched successfully' })
    } catch (err) {
      this.err = err
    }
  },
  computed: {
    displayedOrders () {
      return this.orders.filter(order => order.orderState === this.filter)
    }
  },
  beforeMount () {
    if (this.err) {
      this.$store.dispatch('toast', { $buefy: this.$buefy, message: this.err })
    }
  },
  methods: {
    changeOrderState (state, idx) {
      const orderIdx = this.orders.findIndex(order => order._id === this.displayedOrders[idx]._id)
      const order = this.orders[orderIdx]
      this.$buefy.dialog.confirm({
        title: 'Changing order state',
        message: 'Are you sure you want to change order state?',
        confirmText: 'Yes',
        type: 'is-warning',
        hasIcon: true,
        onConfirm: async () => {
          try {
            await this.$axios.$post(`/orders/changeState/${order._id}`, { orderState: state })
            this.displayedOrders[idx].orderState = state
            order.orderState = state
          } catch (err) {
            this.$store.dispatch('notify', { $buefy: this.$buefy, message: err, type: 'danger' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.order-item {
  border: 1px solid rgb(129, 126, 126);
  padding: 5px;
  border-radius: 10px;
}
</style>
