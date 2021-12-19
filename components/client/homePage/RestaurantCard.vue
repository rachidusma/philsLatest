<template>
  <div class="restaurant-card" :class="{ 'cursor-pointer': profile }" @click="profile ? goToRestaurant() : null">
    <div v-if="!profile" class="restaurant-card--header" />

    <div v-else class="restaurant-card--header">
      <img :src="restaurant.img" :alt="restaurant.title">
    </div>

    <div class="restaurant-card--info p-5">
      <h3 class="has-text-weight-bold is-size-3 has-text-black">
        {{ restaurant.title }}
      </h3>

      <p v-if="!profile">
        <i class="ri-map-pin-line" />
        {{ restaurant.address }}
      </p>

      <p v-if="!profile">
        <i class="ri-time-line" />
        <span class="mx-1">{{ restaurant.openTimes[0] }} - {{ restaurant.openTimes[1] }}</span>
      </p>
      <b-button
        v-if="!profile"
        class="mt-5"
        tag="router-link"
        :to="localePath(`/restaurant/${restaurant.title}`)"
        type="is-info"
        expanded
      >
        {{ $t('stat.order') }}
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleRestaurantCard',
  props: {
    profile: {
      type: Boolean,
      default: () => false
    },
    restaurant: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    goToRestaurant () {
      this.$router.push(this.$i18n.localePath(`/restaurant/${this.restaurant.title}`))
    }
  }
}
</script>

<style scoped>
.restaurant-card {
  border-radius: 20px;
  overflow: hidden;
  background-color: white;
  box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px, rgb(0 0 0 / 4%) 0px 10px 10px -5px;
  /* padding: 0`; */
}

.restaurant-card--header {
  height: 100px;
  background: #311B51;
}

.restaurant-card--info {
  padding: 10px;
}

/* If IN PROFILE */
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer .restaurant-card--header {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cursor-pointer .restaurant-card--header img {
  max-width: 80px !important;
  height: 80px !important;
}
</style>
