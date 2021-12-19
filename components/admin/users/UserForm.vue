<template>
  <div>
    <form style="overflow-x: hidden" @submit.prevent="addUser">
      <div class="columns is-multiline">
        <div class="column is-half-tablet is-one-quarter-desktop">
          <b-field
            :message="!$v.name.required && $v.name.$error ? 'Required' : ''"
            :type="!$v.name.required && $v.name.$error ? 'is-danger' : ''"
            label="User name"
          >
            <b-input v-model="name" placeholder="User name" />
          </b-field>
        </div>

        <div class="column is-half-tablet is-one-quarter-desktop">
          <b-field
            :message="
              $v.email.email && $v.email.$error
                ? 'Enter valid email'
                : $v.email.required && $v.email.$error
                  ? 'Required'
                  : ''
            "
            :type="$v.email.$error ? 'is-danger' : ''"
            label="User Email"
          >
            <b-input v-model="email" placeholder="User Email" />
          </b-field>
        </div>

        <div class="column is-6-tablet is-one-quarter-desktop">
          <b-field
            :message="!$v.phone.required && $v.phone.$error ? 'Required' : ''"
            :type="!$v.phone.required && $v.phone.$error ? 'is-danger' : ''"
            label="User phone"
          >
            <b-input v-model="phone" name="phone" type="tel" placeholder="User phone" />
          </b-field>
        </div>
        <div class="column is-6-tablet is-one-quarter-desktop">
          <b-field label="User postcode">
            <b-input v-model="postcode" name="postcode" type="postcode" placeholder="User postcode" />
          </b-field>
        </div>
      </div>

      <b-field label="Choose restaurant for the user (if any)">
        <b-autocomplete
          v-model="restaurantName"
          :clear-on-select="false"
          :data="filteredDataArray"
          field="title"
          placeholder="Enter restaurant name"
          icon="magnify"
          @select="option => { option ? restaurantId = option._id : null }"
        >
          <template slot-scope="props">
            {{ props.option.title }}
          </template>

          <template #empty>
            No restaurant found
          </template>
        </b-autocomplete>
      </b-field>

      <b-field
        :message="!$v.address.required && $v.address.$error ? 'Required' : ''"
        :type="!$v.address.required && $v.address.$error ? 'is-danger' : ''"
        label="User address"
      >
        <b-input v-model="address" placeholder="User address" />
      </b-field>

      <b-field label="User location">
        <b-input v-model="location" placeholder="User location" />
      </b-field>

      <b-field
        :message="!$v.password.required && $v.password.$error ? 'Required' : ''"
        :type="!$v.password.required && $v.password.$error ? 'is-danger' : ''"
        label="Password"
      >
        <b-input v-model="password" placeholder="Password" password-reveal />
      </b-field>

      <b-field
        :message="$v.confirmPass.sameAs && $v.confirmPass.$error
          ? 'Should match password'
          : $v.confirmPass.required && $v.confirmPass.$error
            ? 'Required'
            : ''"
        :type="!$v.confirmPass.error ? 'is-danger' : ''"
        label="Retype password"
      >
        <b-input v-model="confirmPass" placeholder="Retype password" password-reveal />
      </b-field>

      <b-field
        :message="!$v.role.required && $v.role.$error ? 'Required' : ''"
        :type="!$v.role.required && $v.role.$error ? 'is-danger' : ''"
        label="User Role"
      >
        <b-select v-model="role" expanded placeholder="Select a role">
          <option value="admin">
            Admin
          </option>
          <option value="restaurantOwner">
            Restaurant Owner
          </option>
          <option value="user">
            User
          </option>
        </b-select>
      </b-field>

      <b-field
        :message="!$v.sendMails.required && $v.sendMails.$error ? 'Required' : ''"
        :type="!$v.sendMails.required && $v.sendMails.$error ? 'is-danger' : ''"
      >
        <b-checkbox v-model="sendMails">
          Keep User updated on news, promotions and exclusive offers via SMS & email
        </b-checkbox>
      </b-field>

      <b-button class="mt-5" :loading="formBtnLoading" expanded type="is-success" native-type="submit">
        {{ !editForm ? 'Add' : 'Edit' }} User
      </b-button>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, numeric, sameAs } from 'vuelidate/lib/validators'
export default {
  name: 'UserForm',
  mixins: [validationMixin],
  props: {
    oldUser: {
      type: Object,
      default: () => null
    }
  },
  validations: {
    name: { required },
    password: { required },
    confirmPass: { required, sameAs: sameAs('password') },
    sendMails: { required },
    role: { required },
    email: { required, email },
    address: { required },
    phone: { required, numeric }
  },
  data () {
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      postcode: '',
      password: '',
      confirmPass: '',
      sendMails: false,
      role: null,
      restaurantName: '',
      restaurantId: '',
      restaurants: [],
      location: '',
      formBtnLoading: false,
      editForm: false
    }
  },
  async fetch () {
    try {
      this.restaurants = await this.$axios.$get(`${process.env.baseUrl}/api/restaurants`)
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'There was an error while getting restaurants!' })
    }
  },
  computed: {
    filteredDataArray () {
      return this.restaurants.filter((option) => {
        return this.restaurantName
          ? option.title
            .toString()
            .toLowerCase()
            .includes(this.restaurantName.toLowerCase())
          : false
      })
    }
  },
  watch: {
    oldUser (newVal) {
      if (newVal) {
        this.editForm = true
        this.name = newVal.name
        this.email = newVal.email
        this.phone = newVal.phone
        this.address = newVal.address
        this.postcode = newVal.postcode
        this.sendMails = newVal.sendMails
        this.role = newVal.role
        this.restaurantName = newVal.restaurantName
        this.restaurantId = newVal.restaurantId
        this.location = newVal.location
        // console.log(newVal)
      }
    }
  },
  methods: {
    reset () {
      this.editForm = false
      this.name = ''
      this.email = ''
      this.phone = ''
      this.address = ''
      this.postcode = ''
      this.sendMails = ''
      this.password = ''
      this.confirmPass = ''
      this.role = ''
      this.restaurantName = ''
      this.restaurantId = ''
      this.location = ''

      this.$v.$reset()
    },
    async addUser () {
      this.formBtnLoading = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.formBtnLoading = false
        return
      }

      try {
        const user = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          address: this.address,
          postcode: this.postcode,
          password: this.password,
          sendMails: this.sendMails,
          agreeToTerms: true,
          role: this.role,
          location: this.location
        }
        if (!this.editForm) {
          await this.$axios.$post('/users/', user)
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'User created successfully', type: 'success' })
          this.reset()
        } else {
          delete user.img
          user._id = this.oldUser._id
          await this.$axios.$patch(`/users/${this.$route.params.id}`, user)
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'User edited successfully', type: 'success' })
          this.$router.push('/admin/users')
        }
        this.formBtnLoading = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err })
        this.formBtnLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
