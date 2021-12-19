<template>
  <form class="columns is-flex-wrap-wrap" @submit.prevent="updateUserInfo">
    <div class="column is-half-desktop">
      <b-field
        :message="$v.name.$error ? $t('validations.required') : ''"
        :type="$v.name.$error ? 'is-danger' : ''"
        :label="$t('inputs.name.label')"
      >
        <b-input
          v-model="name"
          :placeholder="$t('inputs.name.placeholder')"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="name = ''"
        />
      </b-field>
    </div>

    <div class="column is-full">
      <b-field
        :message="$v.phone.numeric && $v.phone.$error
          ? $t('validations.onlyNums')
          : $v.phone.required && $v.phone.$error
            ? $t('validations.required')
            : ''"
        :type="$v.phone.$error ? 'is-danger' : ''"
        :label="$t('inputs.Phone number')"
      >
        <b-input
          v-model="phone"
          placeholder="467XXXXXXXX"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="phone = ''"
        />
      </b-field>
    </div>

    <div class="column is-full">
      <b-field :label="$t('inputs.address')">
        <b-input
          v-model="address"
          :placeholder="$t('inputs.address')"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="address = ''"
        />
      </b-field>
    </div>

    <div class="column is-half-desktop">
      <b-field :label="$t('inputs.postcode')">
        <b-input
          v-model="postcode"
          :placeholder="$t('inputs.postcode')"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="postcode = ''"
        />
      </b-field>
    </div>

    <div class="column is-half-desktop">
      <b-field :label="$t('inputs.location')">
        <b-input
          v-model="location"
          :placeholder="$t('inputs.location')"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="location = ''"
        />
      </b-field>
    </div>

    <div class="column is-full">
      <b-button :loading="formBtnLoading" type="is-success" expanded class="my-4" native-type="submit">
        {{ $t('stat.logout') }}
      </b-button>
    </div>

    <div class="column is-full has-text-right">
      <b-button type="is-light" size="is-small" class="has-text-weight-bold" @click="$auth.logout(); $router.push(localePath('/'))">
        {{ $t('stat.submit') }}
      </b-button>
    </div>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'DetailsForm',
  mixins: [validationMixin],
  data () {
    return {
      formBtnLoading: false,
      name: '',
      phone: '',
      address: '',
      postcode: '',
      location: ''
    }
  },
  validations: {
    name: { required },
    phone: { required, numeric }
  },
  mounted () {
    if (this.$auth.loggedIn) {
      this.name = this.$auth.user.name
      this.phone = this.$auth.user.phone
      this.address = this.$auth.user.address
      this.postcode = this.$auth.user.postcode
      this.location = this.$auth.user.location
    }
  },
  methods: {
    async updateUserInfo () {
      this.formBtnLoading = true
      this.phone = this.phone.replace('+', '')
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.formBtnLoading = false
        return
      }
      const updatedUser = {
        name: this.name,
        phone: this.phone,
        address: this.address,
        postcode: this.postcode,
        location: this.location
      }
      try {
        await this.$axios.$patch(`/users/${this.$auth.user._id}`, { user: updatedUser })
        await this.$auth.fetchUser()
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
