<template>
  <div class="wrapper">
    <client-only>
      <side-bar :open-side-bar="openSideBar" @closed="openSideBar = false" />
    </client-only>
    <div style="width: 100%" class="pt-4 px-2 is-flex-grow-0 mx-auto container">
      <client-only>
        <nav class="is-flex is-justify-content-flex-end">
          <div class="is-flex is-align-items-center">
            <small class="has-text-black">
              <b>{{ $t('sidebar.Welcome back!') }}</b>
            </small>
          </div>
          <div class="mx-2 vl" />
          <div class="is-flex is-align-items-center">
            <language-btns />
          </div>
          <div class="mx-2 vl" />
          <div class="is-flex is-align-items-center">
            <burger-btn :is-open="openSideBar" @toggle="openSideBar = true" />
          </div>
          <div class="mx-2 vl" />
          <div class="is-flex is-align-items-center">
            <user-avatar v-if="$auth.user" />
          </div>
        </nav>
      </client-only>
    </div>
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import 'remixicon/fonts/remixicon.css'
import Footer from '~/components/client/layout/Footer.vue'
import SideBar from '~/components/admin/layout/SideBar.vue'
import UserAvatar from '~/components/utils/UserAvatar.vue'
import BurgerBtn from '~/components/utils/BurgerBtn.vue'
import LanguageBtns from '~/components/client/layout/LanguageBtns.vue'

export default {
  components: {
    Footer,
    SideBar,
    UserAvatar,
    BurgerBtn,
    LanguageBtns
  },
  middleware: 'admins',
  data () {
    return {
      openSideBar: false
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

.vl {
  border-left: 2px solid rgb(119, 131, 118);
}
</style>
