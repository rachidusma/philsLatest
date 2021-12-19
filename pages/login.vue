<template>
  <div class="container">
    <section class="p-4 mt-6 card">
      <h3 class="is-size-4 has-text-weight-bold mb-5">
        {{ $t('stat.login') }}
      </h3>

      <form @submit.prevent="login">
        <b-field
          :message="
            $v.email.email && $v.email.$error
              ? $t('validations.validEmail')
              : $v.email.required && $v.email.$error
                ? $t('validations.required')
                : ''
          "
          :type="$v.email.$error ? 'is-danger' : ''"
          :label="$t('inputs.email')"
        >
          <b-input
            v-model="email"
            type="text"
            maxlength="30"
            :placeholder="$t('inputs.email')"
            icon-right="close-circle"
            icon-right-clickable
            @icon-right-click="email = ''"
          />
        </b-field>

        <b-field
          :message="$v.password.required && $v.password.$error ? $t('validations.required') : ''"
          :type="$v.password.required && $v.password.$error ? 'is-danger' : ''"
          :label="$t('inputs.password')"
        >
          <b-input v-model="password" type="password" maxlength="30" :placeholder="$t('inputs.password')" password-reveal />
        </b-field>

        <b-button
          class="mb-3"
          :disabled="email.length == 0 && password.length == 0"
          :loading="formBtnLoading"
          native-type="submit"
          type="is-success"
          expanded
        >
          {{ $t('stat.login') }}
        </b-button>
      </form>

      <div
        class="is-flex is-justify-content-space-between is-align-items-center"
      >
        <nuxt-link class="is-size-7" :to="localePath('/sign-up')">
          {{ $t('stat.signUp') }}
        </nuxt-link>

        <nuxt-link class="is-size-7" :to="localePath('/sign-up')">
          {{ $t('stat.forgotPass') }}
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'LoginPage',
  mixins: [validationMixin],
  middleware: 'loggedIn',
  validations: {
    email: { required, email },
    password: { required }
  },
  props: {
    isOpen: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      open: false,
      formBtnLoading: false,
      email: '',
      password: ''
    }
  },
  watch: {
    isOpen (newValue) {
      this.open = newValue
    }
  },
  methods: {
    async login () {
      this.formBtnLoading = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.formBtnLoading = false
        return
      }
      try {
        await this.$auth.loginWith('local', {
          data: { email: this.email, password: this.password }
        })
        if (this.$auth.user.role === 'client') {
          this.$router.push(this.$i18n.localePath('/'))
        } else if (this.$auth.user.role === 'admin') {
          this.$router.push(this.$i18n.localePath('/admin'))
        } else if (this.$auth.user.role === 'restaurant owner') {
          this.$router.push(this.$i18n.localePath('/admin/owner/'))
        }
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
      this.formBtnLoading = false
    }
  }
}
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
