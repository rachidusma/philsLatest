<template>
  <section id="restaurants" class="py-5">
    <div class="container px-3">
      <div class="is-flex is-justify-content-flex-end">
        <b-field>
          <b-input v-model="searchText" :placeholder="$t('homepage.Search restaurant')" icon-right="magnify" rounded />
        </b-field>
      </div>

      <transition name="fade" :duration="{ enter: 500, leave: 300 }">
        <div v-if="displayedRestaurants.length > 0" class="my-5 is-multiline columns is-4">
          <div
            v-for="restaurant in displayedRestaurants"
            :key="restaurant.title"
            class="column is-one-quarter-widescreen is-one-third-desktop is-6-tablet is-12-mobile"
          >
            <restaurant-card :restaurant="restaurant" />
          </div>
        </div>

        <p v-else class="has-text-centered">
          There's no restaurant with this name..
        </p>
      </transition>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import RestaurantCard from './RestaurantCard.vue'
const customParseFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(customParseFormat)
export default {
  name: 'AllRestaurantsSection',
  components: { RestaurantCard },
  data () {
    return {
      searchText: '',
      restaurants: []
    }
  },
  computed: {
    displayedRestaurants () {
      if (this.searchText) {
        return this.restaurants.filter(restaurant => restaurant.title.includes(this.searchText))
      }
      return this.restaurants
    }
  },
  async beforeMount () {
    const restaurants = await this.$axios.$get(`${process.env.baseUrl}/api/restaurants/client/all`)
    const today = dayjs().day()
    restaurants.forEach((day) => {
      const openTimeToday = dayjs(day.openTimes[today].times[0]).format('hh:mm')
      const closeTimeToday = dayjs(day.openTimes[today].times[1]).format('hh:mm')
      day.openTimes = [openTimeToday, closeTimeToday]
    })
    this.restaurants = restaurants
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
