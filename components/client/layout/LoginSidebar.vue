<template>
  <section>
    <b-sidebar
      v-model="open"
      type="is-white"
      fullheight
      :fullwidth="false"
      :mobile="'fullwidth'"
      overlay
      right
      @close="$emit('closed')"
    >
      <div class="p-4">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center"
        >
          <language-btns />
          <b-button type="is-light" size="is-small" @click="$emit('closed')">
            <i class="ri-close-line" />
          </b-button>
        </div>

        <section class="mt-6">
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
              :message="
                $v.password.required && $v.password.$error
                  ? $t('validations.required')
                  : ''
              "
              :type="
                $v.password.required && $v.password.$error ? 'is-danger' : ''
              "
              :label="$t('inputs.password')"
            >
              <b-input
                v-model="password"
                type="password"
                maxlength="30"
                :placeholder="$t('inputs.password')"
                password-reveal
              />
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
            class="
              is-flex is-justify-content-space-between is-align-items-center
            "
          >
            <b-button
              class="is-size-7"
              @click="
                $emit('closed')
                $router.push(localePath('/sign-up'))
              "
            >
              {{ $t('stat.signUp') }}
            </b-button>

            <b-button
              class="is-size-7"
              @click="
                $emit('closed')
                $router.push(localePath('/sign-up'))
              "
            >
              {{ $t('stat.forgotPass') }}
            </b-button>
          </div>
        </section>
      </div>
    </b-sidebar>
  </section>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

import LanguageBtns from './LanguageBtns.vue'
export default {
  name: 'SideBar',
  components: { LanguageBtns },
  mixins: [validationMixin],
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
  data() {
    return {
      formBtnLoading: false,
      open: false,
      email: '',
      password: ''
    }
  },
  watch: {
    isOpen(newValue) {
      this.open = newValue
    }
  },
  methods: {
    async login() {
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
        this.$router.push(this.localePath('/'))
        this.email = ''
        this.password = ''
        this.$v.$reset()
        this.$store.dispatch('notify', {
          $buefy: this.$buefy,
          message: `${this.$t('messages.Welcome back')} ${
            this.$auth.user.name
          }`,
          type: 'success'
        })

        this.$emit('closed')
      } catch (err) {
        this.$store.dispatch('notify', {
          $buefy: this.$buefy,
          message: err.response.data.msg
        })
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
