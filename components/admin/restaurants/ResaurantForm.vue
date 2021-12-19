<template>
  <div>
    <form @submit.prevent="addRestaurant">
      <b-field
        :message="!$v.title.required && $v.title.$error ? 'Required' : ''"
        :type="!$v.title.required && $v.title.$error ? 'is-danger' : ''"
        label="Restaurant name"
      >
        <b-input v-model="title" placeholder="Restaurant name" />
      </b-field>

      <b-field class="py-6" label="Choose restaurant owner">
        <b-autocomplete
          v-model="userName"
          :clear-on-select="false"
          :data="filteredDataArray"
          field="name"
          placeholder="Enter user name"
          icon="magnify"
          @select="option => { option ? userId = option._id : null }"
        >
          <template slot-scope="props">
            {{ props.option.name }}
          </template>

          <template #empty>
            No user found
          </template>
        </b-autocomplete>
      </b-field>

      <b-field
        v-if="!editForm"
        :message="!$v.file.required && $v.file.$error ? 'Required' : ''"
        :type="!$v.file.required && $v.file.$error ? 'is-danger' : ''"
        label="Restaurant Logo"
      >
        <b-field class="file is-primary" :class="{'has-name': !!file}">
          <b-upload v-model="file" class="file-label" accept="image/*" rounded>
            <span class="file-cta">
              <b-icon class="file-icon" icon="upload" />
              <span class="file-label">{{ file.name || "Click to upload" }}</span>
            </span>
          </b-upload>
        </b-field>
      </b-field>

      <b-field
        :message="
          $v.email.email && $v.email.$error
            ? 'Enter valid email'
            : $v.email.required && $v.email.$error
              ? 'Required'
              : ''
        "
        :type="$v.email.$error ? 'is-danger' : ''"
        label="Restaurant Email"
      >
        <b-input v-model="email" placeholder="Restaurant Email" />
      </b-field>
      <b-field
        :message="!$v.address.required ? 'Required' : ''"
        :type="!$v.address.required ? 'is-danger' : ''"
        label="Restaurant address"
      >
        <b-input v-model="address" placeholder="Restaurant address" />
      </b-field>

      <h3>Open times</h3>
      <b-collapse
        v-for="(day, idx) in openTimes"
        :key="day.day"
        class="card mb-2"
        :open="false"
        animation="slide"
        aria-id="contentIdForA11y3"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">
              {{ day.day }}
            </p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
        </template>

        <div class="card-content">
          <b-field class="mr-1 is-inline-block" label="From">
            <b-timepicker v-model="openTimes[idx].times[0]" inline />
          </b-field>
          <b-field class="mr-1 is-inline-block" label="To">
            <b-timepicker v-model="openTimes[idx].times[1]" inline />
          </b-field>
        </div>
      </b-collapse>
      <!-- End open times -->

      <b-button class="mt-5" :loading="formBtnLoading" expanded type="is-success" native-type="submit">
        {{ !editForm ? 'Add' : 'Edit' }} restaurant
      </b-button>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, requiredUnless } from 'vuelidate/lib/validators'

export default {
  name: 'RestaurantForm',
  mixins: [validationMixin],
  props: {
    rstaurant: {
      type: Object,
      default: () => null
    }
  },
  validations: {
    title: { required },
    email: { required, email },
    file: { requiredUnless: requiredUnless('editForm') },
    address: { required },
    userId: { required },
    // categories: {
    //   required,
    //   $each: {
    //     title: { required },
    //     dishes: { required, minLength: minLength(1) }
    //   }
    // },
    openTimes: {
      required,
      $each: {
        day: { required },
        times: { required, minLength: minLength(2) }
      }
    }
  },
  data () {
    return {
      title: '',
      email: '',
      address: '',
      file: {},
      userId: '',
      userName: '',
      formBtnLoading: false,
      // categories: [],
      users: [],
      editForm: false,
      isOpen: 0,
      name: '',
      dishes: [],
      selected: null,
      openTimes: [
        { day: 'Söndag (Idag)', times: [new Date(), new Date()] },
        { day: 'Måndag', times: [new Date(), new Date()] },
        { day: 'Tisdag', times: [new Date(), new Date()] },
        { day: 'Onsdag', times: [new Date(), new Date()] },
        { day: 'Torsdag', times: [new Date(), new Date()] },
        { day: 'Fredag', times: [new Date(), new Date()] },
        { day: 'Lördag', times: [new Date(), new Date()] }
      ]
    }
  },
  computed: {
    filteredDataArray () {
      return this.users.filter((option) => {
        return this.userName
          ? option.name
            .toString()
            .toLowerCase()
            .includes(this.userName.toLowerCase())
          : false
      })
    }
  },
  watch: {
    rstaurant (newVal) {
      if (newVal) {
        this.title = newVal.title
        this.email = newVal.email
        this.address = newVal.address
        this.userId = newVal.owner._id
        this.userName = newVal.owner.name
        this.openTimes = newVal.openTimes
        this.openTimes.forEach((day) => {
          day.times[0] = new Date(day.times[0])
          day.times[1] = new Date(day.times[1])
        })
        this.editForm = true
      }
    }
  },
  async mounted () {
    try {
      this.users = await this.$axios.$get('/users/')
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err })
    }
  },
  methods: {
    reset () {
      this.title = ''
      this.email = ''
      this.address = ''
      this.categories = []
      this.editForm = false
      this.isOpen = 0
      this.userId = ''
      this.userName = ''
      this.file = {}
      this.name = ''
      this.dishes = []
      this.selected = null
      this.openTimes = [
        { day: 'Måndag', times: [new Date(), new Date()] },
        { day: 'Tisdag', times: [new Date(), new Date()] },
        { day: 'Onsdag', times: [new Date(), new Date()] },
        { day: 'Torsdag', times: [new Date(), new Date()] },
        { day: 'Fredag', times: [new Date(), new Date()] },
        { day: 'Lördag', times: [new Date(), new Date()] },
        { day: 'Söndag (Idag)', times: [new Date(), new Date()] }
      ]
      this.$v.$reset()
    },
    async addRestaurant () {
      this.formBtnLoading = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.formBtnLoading = false
        return
      }

      const restaurant = {
        email: this.email,
        title: this.title,
        address: this.address,
        // categories,
        owner: this.userId,
        openTimes: this.openTimes
      }
      try {
        if (!this.editForm) {
          const formdata = new FormData()
          formdata.append('img', this.file)
          const imgRes = await this.$axios.$post('/image/', formdata)
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Image uploaded successfully', type: 'info' })
          restaurant.img = imgRes

          const restaurantResponse = await this.$axios.$post('/restaurants', restaurant)
          await this.$axios.$post('/restaurants/change/restAdmin', { newUserId: this.userId, restaurantId: restaurantResponse._id })
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Restaurant Created successfully', type: 'success' })
          this.reset()
        } else {
          await this.$axios.$patch(`/restaurants/${this.$route.params.id}`, restaurant)
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Restaurant edited successfully', type: 'success' })
          await this.$axios.$post('/restaurants/change/restAdmin', { newUserId: this.userId, restaurantId: this.$route.params.id })
          this.$router.push('/admin/restaurant')
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
