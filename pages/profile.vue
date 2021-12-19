<template>
  <div class="container is-flex is-justify-content-center is-align-items-center">
    <section class="mt-4 mb-6 tabs-wrapper">
      <b-tabs v-model="activeTab" class="block">
        <b-tab-item :label="$t('profile.Order history')">
          <h3 class="mb-3 is-size-3">
            {{ $t('profile.favorites') }}
          </h3>
          <div v-if="userFav.length > 0" class="my-5 is-multiline columns is-4">
            <div
              v-for="restaurant in userFav"
              :key="restaurant.title"
              class="column is-one-quarter-widescreen is-one-third-desktop is-6-tablet is-12-mobile"
            >
              <restaurant-card :profile="true" :restaurant="restaurant" />
            </div>
          </div>

          <p v-else class="has-text-centered">
            {{ $t('profile.noRestaurants') }}
          </p>
        </b-tab-item>
        <b-tab-item :label="$t('profile.Subscriptions')">
          <p>{{ $t('profile.noSubscriptions') }}</p>
        </b-tab-item>
        <b-tab-item :label="$t('profile.General settings')">
          <details-form />
        </b-tab-item>
        <b-tab-item :label="$t('profile.Change password')">
          <password-form />
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import RestaurantCard from '~/components/client/homePage/RestaurantCard.vue'
import DetailsForm from '~/components/client/profile/DetailsForm.vue'
import PasswordForm from '~/components/client/profile/PasswordForm.vue'

export default {
  name: 'ProfilePage',
  components: { DetailsForm, PasswordForm, RestaurantCard },
  middleware ({ redirect, app }) {
    const token = app.$axios.defaults.headers.common['x-auth-token']
    if (!token) {
      redirect('/')
    }
  },
  data () {
    return {
      activeTab: 0,
      userFav: []
    }
  },
  async mounted () {
    try {
      this.userFav = await this.$axios.$post('/restaurants/client/getUserFav', { userFav: this.$auth.user.fav })
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
    }
  }
}
</script>

<style scoped>
.tabs-wrapper {
  max-width: 700px;
  min-height: 700px
}

@media screen and (max-width: 768px) {
  .tabs-wrapper {
    max-width: 450px;
  }
}
</style>
