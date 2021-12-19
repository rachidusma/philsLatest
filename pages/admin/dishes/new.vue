<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Add dish:</h3>

      <dish-form />
    </section>
  </div>
</template>

<script>
import DishForm from '~/components/admin/dishes/dishForm.vue'

export default {
  name: 'NewDishPage',
  components: { DishForm },
  layout: 'admin'
}
</script>
