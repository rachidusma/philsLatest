<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Choose a restaurant to see its orders:</h3>
      <div class="columns is-flex is-flex-wrap-wrap">
        <div v-for="(restaurant, index) in restaurants" :key="restaurant.title+index" class="column is-12-mobile is-6-tablet is-one-quarter-desktop">
          <div class="card is-cursor-pointer" @click="$router.push(`/admin/orders/${restaurant._id}`)">
            <header class="card-header">
              <p class="card-header-title">
                {{ restaurant.title }}
              </p>
            </header>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AdminOrderPage',
  layout: 'admin',
  middleware: 'admins',
  data () {
    return {
      restaurants: []
    }
  },
  async fetch () {
    try {
      const restaurants = await this.$axios.$get(`${process.env.baseUrl}/api/restaurants`)
      this.restaurants = restaurants
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err })
    }
  }
}
</script>

<style scoped>

</style>
