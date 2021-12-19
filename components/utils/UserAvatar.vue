<template>
  <div>
    <b-dropdown aria-role="list" position="is-bottom-left">
      <template #trigger>
        <span class="user-avatar">
          {{ $auth.user.name}}
        </span>
      </template>

      <b-dropdown-item
        v-if="$auth.user.role !== 'client'"
        aria-role="listitem"
        has-link
      >
        <nuxt-link :to="localePath('/admin')">
          <i class="mr-1 ri-dashboard-line" />
          {{ $t('userAvatar.Dashboard') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" has-link>
        <nuxt-link :to="localePath('/profile')">
          <i class="mr-1 ri-user-line" />
          {{ $t('userAvatar.profile') }}
        </nuxt-link>
      </b-dropdown-item>
      <b-dropdown-item
        aria-role="listitem"
        class="has-text-danger"
        @click="
          $auth.logout()
          $router.push(localePath('/'))
        "
      >
        <i class="mr-1 ri-logout-box-line" />
        {{ $t('userAvatar.Logout') }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.user-avatar {
  user-select: none;
  cursor: pointer;
  font-size: calc(1rem);
  line-height: 2rem;
  vertical-align: top;
  display: inline-flex;
  border-radius: 50%;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  position: relative;
  width: 35px;
  height: 35px;
  background-color: rgb(92, 89, 238);
  color: rgb(255, 255, 255);
}
</style>
