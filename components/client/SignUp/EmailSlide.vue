<template>
  <section class="card">
    <h4 class="mb-3">
      {{ $t('signUpPage.create account') }}
    </h4>

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

    <b-button
      class="mb-3"
      :loading="formBtnLoading"
      :disabled="$v.email.$error"
      type="is-success"
      expanded
      @click="nextSlide"
    >
      {{ $t('stat.next') }}
    </b-button>

    <small>
      {{ $t('signUpPage.alreadyHaveAnAccount') }} <nuxt-link :to="localePath('/login')">{{ $t('stat.login') }}</nuxt-link>
    </small>
  </section>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  data () {
    return {
      email: '',
      formBtnLoading: false
    }
  },
  validations: {
    email: { required, email }
  },
  methods: {
    nextSlide () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.formBtnLoading = false
        return
      }
      this.$emit('emailChecked', this.email)
    }
  }
}
</script>

<style scoped>
.card {
  width: 40rem;
  padding: 20px;
}

/* Small screens */
@media screen and (max-width: 768px){
  .card {
    width: 100%
  }
}
</style>
