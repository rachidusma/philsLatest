<template>
  <div class="content">
    <div class="container h-100">
      <div class="h-100 is-flex is-justify-content-center is-align-items-center">
        <b-carousel v-model="currentSlide" :autoplay="false" :indicator="false" :arrow="false">
          <b-carousel-item>
            <div class="sign-up h-100">
              <email-slide @emailChecked="email = $event; currentSlide = 1" />
            </div>
          </b-carousel-item>
          <!-- End Email -->
          <b-carousel-item>
            <b-button class="mb-3" rounded @click="currentSlide = 0">
              <i class="ri-arrow-left-line" />
            </b-button>
            <more-details-slide :email="email" @formFilled="signUp($event)" />
          </b-carousel-item>
          <!-- End More Details -->
          <b-carousel-item>
            <div class="p-6 has-text-centered card">
              <h3>✌️</h3>
              <h4>{{ $t('signUpPage.Almost done!') }}</h4>
              <p class="mt-6">
                {{ $t('signUpPage.We need to confirm your email address') }}, {{ email }}.
                {{ $t('signUpPage.ToCompleteTheProcess') }}
              </p>
            </div>
          </b-carousel-item>
        </b-carousel>
      </div>
    </div>
  </div>
</template>

<script>
import EmailSlide from '~/components/client/SignUp/EmailSlide.vue'
import MoreDetailsSlide from '~/components/client/SignUp/MoreDetailsSlide.vue'

export default {
  name: 'SignUpPage',
  components: { EmailSlide, MoreDetailsSlide },
  middleware: 'loggedIn',
  data () {
    return {
      currentSlide: 0,
      email: ''
    }
  },
  head () {
    return {
      title: 'Sign Up'
    }
  },
  methods: {
    async signUp (user) {
      try {
        delete user.confirmPass
        const userObj = { ...user }
        await this.$axios.post('/users/', userObj)
        this.currentSlide = 2
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, type: 'success', message: err.response.data.msg })
      }
    }
  }
}
</script>

<style scoped>
.sign-up {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
