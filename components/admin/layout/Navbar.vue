<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        Phil's Burger
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item tag="router-link" to="/admin/categories">
        Categories
      </b-navbar-item>
      <b-navbar-item tag="div">
        <b-dropdown append-to-body aria-role="menu" max-height="200" trap-focus>
          <template #trigger>
            <a class="navbar-item" role="button">
              <span>Dishes</span>
              <b-icon icon="menu-down" />
            </a>
          </template>

          <b-dropdown-item has-link aria-role="listitem">
            <nuxt-link to="/admin/dishes/new">
              Add Dish
            </nuxt-link>
          </b-dropdown-item>

          <b-dropdown-item has-link aria-role="listitem">
            <nuxt-link to="/admin/dishes/">
              All Dishes
            </nuxt-link>
          </b-dropdown-item>
        </b-dropdown>
      </b-navbar-item>
      <b-navbar-item tag="div">
        <b-dropdown append-to-body aria-role="menu" max-height="200" trap-focus>
          <template #trigger>
            <a class="navbar-item" role="button">
              <span>Restaurants</span>
              <b-icon icon="menu-down" />
            </a>
          </template>

          <b-dropdown-item has-link aria-role="listitem">
            <nuxt-link to="/admin/restaurant/new">
              Add Restaurant
            </nuxt-link>
          </b-dropdown-item>

          <b-dropdown-item has-link aria-role="listitem">
            <nuxt-link to="/admin/restaurant/">
              All Restaurants
            </nuxt-link>
          </b-dropdown-item>
        </b-dropdown>
        <!-- <b-button id="login-large" type="is-text" size="is-small">
          Logga out
        </b-button> -->
        <!-- <language-btns /> -->
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
// import UserAvatar from '../../utils/UserAvatar.vue'
export default {
  name: 'AdminNavbar',
  // components: { UserAvatar },
  mounted () {
    this.initClientOnlyComp()
    const loginLarge = document.getElementById('login-large')
    const loginTouch = document.getElementById('login-touch')
    if (loginTouch) { loginTouch.addEventListener('click', this.toggleSideBar) }
    if (loginLarge) { loginLarge.addEventListener('click', this.toggleSideBar) }
  },
  methods: {
    toggleSideBar () {
      this.$emit('toggleSideBar')
    },
    initClientOnlyComp (count = 10) {
      this.$nextTick(() => {
        if (this.$refs.myComp || this.$refs.myComp2) {
          console.log('you\'r ready')
        } else if (count > 0) {
          console.log('you\'r not ready', this.$auth.loggedIn)
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
