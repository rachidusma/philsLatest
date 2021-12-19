<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Add User:</h3>

      <user-form />
    </section>
  </div>
</template>

<script>
import UserForm from '~/components/admin/users/UserForm.vue'

export default {
  name: 'NewUserPage',
  components: { UserForm },
  layout: 'admin'
}
</script>
