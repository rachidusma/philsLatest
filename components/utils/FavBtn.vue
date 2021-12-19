<template>
  <b-button :class="isInUserFav ? 'has-text-danger' : ''" :loading="disableFavButton" icon-left="heart" @click="addToFav">
    {{ $t('orderPage.favorit') }}
  </b-button>
</template>

<script>
export default {
  name: 'FavBtn',
  props: {
    restaurantId: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      disableFavButton: false
    }
  },
  computed: {
    isInUserFav () {
      return this.$auth.loggedIn && this.$auth.user ? this.$auth.user.fav.includes(this.restaurantId) : false
    }
  },
  methods: {
    async addToFav () {
      if (!this.$auth.loggedIn) {
        this.$store.commit('sideBarState')
      } else {
        try {
          this.disableFavButton = true
          await this.$axios.post(`/users/fav/${this.$auth.user._id}`, { productId: this.restaurantId })
          await this.$auth.fetchUser()
          if (!this.isInUserFav) { // Removed
            this.$store.dispatch('notify', { $buefy: this.$buefy, type: 'success', message: this.$t('orderPage.Restaurant removed from your favurites') })
          } else {
            this.$store.dispatch('notify', { $buefy: this.$buefy, type: 'success', message: this.$t('orderPage.Restaurant added to your favurites') })
          }
        } catch (error) {
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: error, type: 'danger' })
        }
        this.disableFavButton = false
      }
    }
  }
}
</script>

<style>

</style>
