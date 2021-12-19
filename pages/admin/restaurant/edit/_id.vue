<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Edit Restaurant:</h3>

      <resaurant-form :rstaurant="restaurant" />
    </section>
  </div>
</template>

<script>
import ResaurantForm from '~/components/admin/restaurants/ResaurantForm.vue'

export default {
  name: 'EditRestaurantPage',
  components: { ResaurantForm },
  layout: 'admin',
  data () {
    return {
      restaurant: null
    }
  },
  async mounted () {
    try {
      this.restaurant = await this.$axios.$get(`/restaurants/${this.$route.params.id}`)
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err })
    }
  }
}
</script>

<style>
</style>
