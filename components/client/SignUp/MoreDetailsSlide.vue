<template>
  <div class="card p-6 moreDetails">
    <b-field :label="$t('inputs.name.label')">
      <b-input v-model="name" required :placeholder="$t('inputs.name.placeholder')" />
    </b-field>

    <b-field :label="$t('inputs.Phone number')">
      <b-input v-model="phone" required placeholder="467XXXXXXXX" />
    </b-field>

    <b-field :label="$t('inputs.email')">
      <b-input :value="email" disabled />
    </b-field>

    <b-field :label="$t('inputs.password')">
      <b-input v-model="password" type="password" required :placeholder="$t('inputs.password')" password-reveal />
    </b-field>

    <b-field :label="$t('inputs.confirmPassword')">
      <b-input v-model="confirmPass" type="password" required :placeholder="$t('inputs.confirmPassword')" password-reveal />
    </b-field>

    <b-field>
      <b-checkbox v-model="sendMails">
        {{ $t('inputs.Keep me updated') }}
      </b-checkbox>
    </b-field>

    <b-field>
      <b-checkbox v-model="agreeToTerms" required>
        {{ $t('inputs.I agree to the') }} <nuxt-link to="/terms">
          {{ $t('inputs.Terms of use') }}
        </nuxt-link>
      </b-checkbox>
    </b-field>
    <b-button class="mb-3" type="is-success" :disabled="!validForm" expanded @click="nextSlide">
      {{ $t('stat.Create account') }}
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      name: '',
      phone: '',
      password: '',
      confirmPass: '',
      sendMails: false,
      agreeToTerms: false
    }
  },
  computed: {
    validForm () {
      const namesValid = !!this.name
      const phoneValid = !!this.phone
      const passValid = this.password.length > 0 && this.password === this.confirmPass
      return namesValid && phoneValid && passValid && this.agreeToTerms
    }
  },
  methods: {
    nextSlide () {
      this.$emit('formFilled', {
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.password,
        confirmPass: this.confirmPass,
        sendMails: this.sendMails,
        agreeToTerms: this.agreeToTerms
      })
    }
  }
}
</script>

<style  scoped>

</style>
