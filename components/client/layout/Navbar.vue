<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: localePath('/') }">
        Phil's Burger
      </b-navbar-item>
    </template>

    <template #burger>
      <div class="touch-login is-hidden-desktop">
        <user-avatar v-if="$auth.loggedIn" ref="myComp" />
        <b-button
          v-show="!$auth.loggedIn"
          id="login-touch"
          ref="myComp2"
          type="is-light"
          class="has-text-weight-bold"
          size="is-small"
          icon-right="account"
          @load="addEvents"
        >
          {{ $t('stat.login') }}
        </b-button>
      </div>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <language-btns class="mx-2" />
          <user-avatar v-if="$auth.loggedIn" />
          <div v-show="!$auth.loggedIn">
            <b-button class="signup-button" size="is-small" tag="router-link" to="/sign-up">
              {{ $t('stat.signUp') }}
            </b-button>
            <b-button id="login-large" type="is-text" size="is-small">
              {{ $t('stat.login') }}
            </b-button>
          </div>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import LanguageBtns from './LanguageBtns.vue'
import UserAvatar from '~/components/utils/UserAvatar.vue'
export default {
  components: { LanguageBtns, UserAvatar },
  mounted () {
    this.initClientOnlyComp()
    this.addEvents()
  },
  methods: {
    eh () {
      this.addEvents()
    },
    addEvents () {
      const loginLarge = document.getElementById('login-large')
      const loginTouch = document.getElementById('login-touch')
      if (loginTouch) { loginTouch.addEventListener('click', this.toggleSideBar) }
      if (loginLarge) { loginLarge.addEventListener('click', this.toggleSideBar) }
      this.$refs.myComp2.$el.addEventListener('click', this.toggleSideBar)
    },
    toggleSideBar () {
      this.$emit('toggleSideBar')
    },
    initClientOnlyComp (count = 10) {
      this.$nextTick(() => {
        if (this.$refs.myComp || this.$refs.myComp2) {
          console.log('you\'r ready')
        } else if (count > 0) {
          this.initClientOnlyComp(count - 1)
        }
      })
    }
  }
}
</script>

<style scoped>
button * {
  height: 20px;
  width: 20px;
}

.signup-button {
  border: 2px solid #000;
}

.navbar-brand a {
  color: rgb(8, 70, 37);
  font-size: 1.875rem;
  line-height: 1.25;
  font-weight: 700;
  text-align: center;
}

.navbar-brand a:hover {
  color: none;
}

.touch-login {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: stretch;
}
</style>
