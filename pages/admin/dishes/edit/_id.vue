<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Edit dish:</h3>

      <dish-form :old-dish="dish" />
    </section>
  </div>
</template>

<script>
import DishForm from '~/components/admin/dishes/dishForm.vue'

export default {
  name: 'EditDishPage',
  components: { DishForm },
  layout: 'admin',
  data () {
    return {
      dish: null
    }
  },
  async mounted () {
    this.dish = await this.$axios.$get(`/dishes/${this.$route.params.id}`)
  }
}
</script>
