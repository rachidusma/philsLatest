<template>
  <b-collapse class="card mb-2" :open="false" animation="slide" aria-id="contentIdForA11y3">
    <template #trigger="props">
      <div class="card-header" role="button" aria-controls="contentIdForA11y3">
        <p class="card-header-title">
          {{ title }}
        </p>

        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
    </template>

    <div class="card-content">
      <title-and-price :old-items="oldItems" @changed="$emit('changeItems', $event)" />
    </div>
  </b-collapse>
</template>

<script>
import titleAndPrice from './titleAndPrice.vue'
export default {
  components: { titleAndPrice },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    oldItems: {
      type: Array,
      default: () => []
    }
  }

}
</script>

<style>

</style>
