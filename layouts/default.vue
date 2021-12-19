<template>
  <div class="wrapper">
    <login-sidebar :is-open="sideBarState" @closed="toggleSideBar" />
    <client-only>
      <Navbar @toggleSideBar="toggleSideBar" />
    </client-only>
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '@/components/client/layout/Navbar.vue'
import 'remixicon/fonts/remixicon.css'
import LoginSidebar from '~/components/client/layout/LoginSidebar.vue'
import Footer from '~/components/client/layout/Footer.vue'

export default {
  components: {
    Navbar,
    LoginSidebar,
    Footer
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapState(['sideBarState'])
  },
  methods: {
    toggleSideBar () {
      this.$store.commit('sideBarState')
    }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
