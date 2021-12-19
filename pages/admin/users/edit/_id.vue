<template>
  <div class="content">
    <section class="mt-5 container">
      <h3>Edit user:</h3>

      <user-form :old-user="user" />
    </section>
  </div>
</template>

<script>
import UserForm from '~/components/admin/users/UserForm.vue'

export default {
  name: 'EditUserPage',
  components: { UserForm },
  layout: 'admin',
  data () {
    return {
      user: null
    }
  },
  async mounted () {
    this.user = await this.$axios.$get(`/users/one/${this.$route.params.id}`)
  }
}
</script>
