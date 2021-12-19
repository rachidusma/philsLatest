<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Add Restaurant:</h3>

      <resaurant-form />
    </section>
  </div>
</template>

<script>
import ResaurantForm from '~/components/admin/restaurants/ResaurantForm.vue'

export default {
  name: 'NewRestaurantPage',
  components: { ResaurantForm },
  layout: 'admin'
}
</script>

<style>
</style>
