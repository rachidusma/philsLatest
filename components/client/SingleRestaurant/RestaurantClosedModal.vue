<template>
  <div>
    <b-modal :open="isOpen">
      <div class="card py-5 p-3">
        <h3 v-if="restaurant" class="is-size-3 has-text-weight-bold has-text-centered">
          {{ restaurant.title }}
        </h3>
        <div class="has-text-centered">
          <img width="128px" src="/PhilsBurger_Logo_Rund_Sv.png" :alt="restaurant.title">
        </div>
        <h5 class="is-size-5 has-text-weight-bold has-text-centered">
          {{ $t('orderPage.The restaurant is closed') }}
        </h5>
        <p v-if="days" class="is-size-6 has-text-centered">
          {{ $t('orderPage.Open') }} - {{ $t('orderPage.today') }}: {{ days.times[0] }} - {{ days.times[1] }}
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    restaurant: {
      type: Object,
      default: () => null
    },
    days: {
      type: Object,
      default: () => null
    },
    isOpen: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style scoped>

</style>
