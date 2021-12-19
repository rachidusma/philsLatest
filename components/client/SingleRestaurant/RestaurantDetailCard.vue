<template>
  <section>
    <div class="container">
      <div class="card p-5 ">
        <div class="card--img pr-3">
          <img width="128px" style="max-height: 130px" :src="info.img" :alt="info.title">
        </div>

        <div class="card--info">
          <fav-btn class="is-hidden-desktop" :restaurant-id="restaurantId" />
          <h2 class="is-size-2-desktop is-size-4-touch has-text-black has-text-weight-bold">
            {{ info.title }}
          </h2>
          <!-- Email -->
          <div>
            <a class="has-text-black" target="_blank" href="mailto:robert@thw.se?subject=Hello">
              <i class="ri-mail-line" />
              {{ info.email }}
            </a>
          </div>
          <!-- Address -->
          <div>
            <a class="has-text-black" target="_blank" href="https://www.google.com/maps/search/?api=1&query=THW%20Tuletorget,+Tulegatan%2010%2C%2017278%2C%20Sundbyberg">
              <i class="ri-map-pin-line" />
              {{ info.address }}
            </a>
          </div>
          <!-- Openning hours -->
          <b-tooltip
            :triggers="['click']"
            :auto-close="['outside', 'escape']"
            position="is-bottom"
          >
            <template #content>
              <p class="mb-1">
                <i class="ri-time-line" />
                <span class="mx-1">{{ $t('orderPage.openTimes') }}</span>
              </p>
              <hr class="p-0 m-0">
              <div v-for="day in openTimes" :key="day.label" class="is-flex is-justify-content-space-between is-align-items-center">
                <p>{{ day.day }}</p>
                <p>{{ day.times[0] }} - {{ day.times[1] }}</p>
              </div>
            </template>

            <div v-if="openTimes[today]">
              <i class="ri-time-line" /> {{ $t('orderPage.today') }}: {{ openTimes[today].times[0] }} - {{ openTimes[today].times[1] }} <span style="color: #70BD88">{{ $t('orderPage.more') }}</span>
            </div>
          </b-tooltip>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FavBtn from '../../utils/FavBtn.vue'
export default {
  name: 'RestaurantInfoSection',
  components: { FavBtn },
  props: {
    restaurantId: {
      type: String,
      default: () => ''
    },
    info: {
      type: Object,
      default: () => null
    },
    today: {
      type: Number,
      default: () => 0
    },
    openTimes: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 280px;
  background: #54595f;
}

.card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 50%
}

/* Small screens */
@media screen and (max-width: 768px){
  .card {
    margin: 20px;
    flex-direction: column;
    max-width: 100%
  }

  .card .card--info {
    margin-top: 20px
  }
}

/* Large screens */
@media screen and (min-width: 769px) and (max-width: 1024px){
  .card {
    margin-left: 20px;
    max-width: 70%
  }
}
</style>
