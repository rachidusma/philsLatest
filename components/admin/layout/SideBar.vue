<template>
  <b-sidebar
    :open="openSideBar"
    type="is-light"
    fullheight
    fullwidth
    overlay
    @close="$emit('closed')">
    <div class="p-1">
      <div class="is-flex mb-3 is-justify-content-space-between">
        <b-button
          type="is-ghost"
          :label="$t('sidebar.Home page')"
          @click="goTo('/')" />
        <burger-btn :is-open="openSideBar" @toggle="$emit('closed')" />
      </div>

      <b-menu>
        <b-menu-list :label="$t('sidebar.Admin links')">
          <b-menu-item
            :label="$t('sidebar.Dashboard')"
            @click="goTo('/admin/')" />
          <b-menu-item
            v-if="$auth.loggedIn && $auth.user.role === 'admin'"
            :label="$t('sidebar.All Restaurants')"
            @click="goTo('/admin/restaurant/')" />
          <b-menu-item
            :label="$t('sidebar.All Categories')"
            @click="goTo('/admin/categories/')" />
          <b-menu-item
            v-if="$auth.loggedIn && $auth.user.role === 'admin'"
            :label="$t('sidebar.All Users')"
            @click="goTo('/admin/users/')" />
          <b-menu-item
            :label="$t('sidebar.All Dishes')"
            @click="goTo('/admin/dishes/')" />
          <b-menu-item
            v-if="$auth.loggedIn && $auth.user.role === 'admin'"
            :label="$t('sidebar.All Orders')"
            @click="goTo('/admin/orders/')" />
          <b-menu-item
            v-if="$auth.loggedIn && $auth.user.role !== 'admin'"
            :label="$t('sidebar.All Orders')"
            @click="goTo(`/admin/orders/${$auth.user.restaurantId}`)" />
        </b-menu-list>

        <b-menu-list :label="$t('sidebar.Menu')">
          <b-menu-item
            v-for="(rest, restaurantIdx) in restaurants"
            :key="rest._id"
            icon="store-outline"
            class="is-relative">
            <template #label="props">
              {{ rest.title }}
              <b-icon
                class="is-pulled-right"
                :icon="props.expanded ? 'menu-down' : 'menu-up'" />
            </template>
            <b-menu-item
              icon="pencil-outline"
              :label="$t('sidebar.Edit Restaurant')"
              @click="goTo(`/admin/restaurant/edit/${rest._id}`)" />
            <b-menu-item
              v-for="(category, categoryIdx) in rest.cate"
              :key="category._id"
              icon="shape-outline"
              @click="menuClicked(category, categoryIdx, restaurantIdx)">
              <template #label>
                {{ category.title }}
              </template>
              <b-menu-list :label="$t('sidebar.Dishes')">
                <b-menu-item
                  v-for="dish in category.dishes"
                  :key="dish._id"
                  icon="pasta"
                  :label="dish.title"
                  @click="goTo(`/admin/dishes/edit/${dish._id}`)" />
                <b-loading v-model="isLoading" :is-full-page="false" />
              </b-menu-list>
            </b-menu-item>
          </b-menu-item>
          <b-menu-list :label="$t('sidebar.Actions')">
            <b-menu-item
              :label="$t('stat.logout')"
              @click="
                $auth.logout()
                $router.push(localePath('/'))
              " />
          </b-menu-list>
        </b-menu-list>
      </b-menu>
    </div>
  </b-sidebar>
</template>

<script>
import BurgerBtn from '~/components/utils/BurgerBtn.vue'
export default {
  components: { BurgerBtn },
  props: {
    openSideBar: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      isLoading: false,
      restaurants: []
    }
  },
  async mounted() {
    this.restaurants = await this.$axios.$get('/stats/dashboard/restaurants')
  },
  methods: {
    goTo(link) {
      this.$emit('closed')
      this.$router.push(this.localePath(link))
    },
    async menuClicked(category, categoryIdx, restaurantIdx) {
      this.isLoading = true
      if (!this.restaurants[restaurantIdx].cate[categoryIdx].dishes) {
        try {
          const res = await this.$axios.$get(
            `/dishes/with-cate/${category._id}`
          )
          this.restaurants[restaurantIdx].cate[categoryIdx].dishes = res
        } catch (err) {
          this.$store.dispatch('notify', {
            $buefy: this.$buefy,
            message: err.response.data.msg
          })
        }
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
</style>
