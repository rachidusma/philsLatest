<template>
  <form class="columns is-flex-wrap-wrap" @submit.prevent="updateUserPassword">
    <div class="column is-full">
      <b-field :label="$t('inputs.Current password')" :message="$v.currentPassword.$error ? $t('validations.required') : ''" :type="$v.currentPassword.$error ? 'is-danger' : ''">
        <b-input
          v-model="currentPassword"
          type="password"
          password-reveal
          :placeholder="$t('inputs.Current password')"
        />
      </b-field>
    </div>

    <div class="column is-full">
      <b-field :label="$t('inputs.New password')" :message="$v.newPassword.$error ? $t('validations.required') : ''" :type="$v.newPassword.$error ? 'is-danger' : ''">
        <b-input
          v-model="newPassword"
          type="password"
          password-reveal
          :placeholder="$t('inputs.New password')"
        />
      </b-field>
    </div>

    <div class="column is-full">
      <b-field :label="$t('inputs.Retype new password')" :message="$v.confirmNewPass.$error ? $t('validations.Should be like new password') : ''" :type="$v.confirmNewPass.$error ? 'is-danger' : ''">
        <b-input
          v-model="confirmNewPass"
          type="password"
          password-reveal
          :placeholder="$t('inputs.Retype new password')"
        />
      </b-field>
    </div>

    <div class="column is-full">
      <b-button
        :disabled="!valid"
        :loading="formBtnLoading"
        type="is-success"
        expanded
        class="my-4"
        native-type="submit"
      >
        {{ $t('inputs.Update password') }}
      </b-button>
    </div>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, sameAs } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  data () {
    return {
      formBtnLoading: false,
      currentPassword: '',
      newPassword: '',
      confirmNewPass: ''
    }
  },
  computed: {
    valid () {
      return (
        !!this.newPassword &&
        this.newPassword === this.confirmNewPass &&
        !!this.currentPassword
      )
    }
  },
  validations: {
    currentPassword: { required },
    newPassword: { required },
    confirmNewPass: { required, sameAsNewPassword: sameAs('newPassword') }
  },

  methods: {
    async updateUserPassword () {
      this.formBtnLoading = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.formBtnLoading = false
        return
      }
      const updatedUser = {
        password: this.newPassword,
        oldPassword: this.currentPassword
      }
      try {
        await this.$axios.$patch(`/users/${this.$auth.user._id}`, { user: updatedUser })
        await this.$auth.fetchUser()
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmNewPass = ''
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Updated Successfuly', type: 'success' })
      } catch (error) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: error.response.data.msg })
      }
      this.formBtnLoading = false
    }
  }
}
</script>

<style>

</style>
