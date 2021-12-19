<template>
  <div class="content">
    <section class="mt-5 container">
      <div class="mt-5 mb-4">
        <h3>{{ $t('index.Overview') }}</h3>

        <div class="columns is-flex is-flex-wrap-wrap">
          <div v-for="(card, index) in cards" :key="card.title+index" class="column is-12-mobile is-6-tablet is-one-quarter-desktop">
            <info-card :subtitle="card.title" :count="card.num" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import InfoCard from '~/components/admin/home/InfoCard.vue'
export default {
  name: 'AdminHomePage',
  components: { InfoCard },
  layout: 'admin',
  data () {
    return {
      cards: []
    }
  },
  async fetch () {
    try {
      const stats = await this.$axios.$get(`${process.env.baseUrl}/api/stats/dashboard/overview`)
      const counts = [
        { num: stats.restaurans, title: this.$t('index.Restaurans') },
        { num: stats.dishes, title: this.$t('index.Dishes') },
        { num: stats.categories, title: this.$t('index.Categories') },
        { num: stats.orders, title: this.$t('index.Orders') },
        { num: stats.admins, title: this.$t('index.Admins') },
        { num: stats.owners, title: this.$t('index.Owners') },
        { num: stats.clients, title: this.$t('index.Clients') }
      ]
      this.cards = counts
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err })
    }
  }
}
</script>

<style scoped>

</style>
