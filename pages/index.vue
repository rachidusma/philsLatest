<template>
  <div>
    <banner />
    <all-restaurants />
  </div>
</template>

<script>
import Banner from '~/components/client/homePage/Banner.vue'
import AllRestaurants from '~/components/client/homePage/AllRestaurants.vue'

export default {
  name: 'HomePage',
  components: { Banner, AllRestaurants },
  head () {
    return {
      title: 'Home'
    }
  }
}
</script>

<style scoped>

</style>
