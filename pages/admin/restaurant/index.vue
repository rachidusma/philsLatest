<template>
  <div class="content">
    <section class="mt-5 container">
      <div class="mt-5 mb-4 is-flex is-justify-content-space-between is-align-items-center">
        <h3>All restaurants:</h3>
        <b-button type="is-info" icon-right="plus" @click="$router.push('/admin/restaurant/new')">
          Add new restaurant
        </b-button>
      </div>
      <b-table
        :data="restaurants"
        hoverable
        :loading="isLoading"
      >
        <b-table-column v-slot="props" searchable field="title" label="Name">
          {{ props.row.title }}
        </b-table-column>

        <b-table-column v-slot="props" field="img" label="Image">
          <img :src="props.row.img" width="70px" :alt="props.row.title">
        </b-table-column>

        <b-table-column v-slot="props" searchable field="owner.name" label="Restaurant Owner">
          {{ props.row.owner ? props.row.owner.name : '-' }}
          <b-button class="mx-3" icon-right="pencil-outline" @click="restaurantId = props.row._id; changeOwnerModal = true" />
        </b-table-column>

        <b-table-column v-slot="props" searchable field="email" label="Email">
          {{ props.row.email }}
        </b-table-column>

        <b-table-column v-slot="props" searchable field="address" label="Address">
          {{ props.row.address }}
        </b-table-column>

        <b-table-column v-slot="props">
          <b-button type="is-danger" size="is-small" icon-right="delete" @click="deleteRestaurant(props.row._id)" />
          <b-button type="is-warning" size="is-small" icon-right="square-edit-outline" @click="$router.push(`/admin/restaurant/edit/${props.row._id}`)" />
          <b-button type="is-warning" size="is-small" icon-right="square-edit-outline" @click="restaurantForEdit = props.row; isCardModalActive = true">
            Edit image
          </b-button>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">
            No Restaurants Yet
          </div>
        </template>
      </b-table>

      <b-modal
        v-model="isCardModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="true"
        aria-role="dialog"
        aria-label="Edit Restaurant Image"
        aria-modal
      >
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              Edit Image
            </p>
            <button type="button" class="delete" @click="isCardModalActive = false; restaurantForEdit = {}" />
          </header>
          <section class="modal-card-body">
            <b-field label="Included filename">
              <b-field class="file is-primary" :class="{'has-name': !!file}">
                <b-upload v-model="file" class="file-label" rounded>
                  <span class="file-cta">
                    <b-icon class="file-icon" icon="upload" />
                    <span class="file-label">{{ file.name || "Click to upload" }}</span>
                  </span>
                </b-upload>
              </b-field>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button label="Close" @click="isCardModalActive = false; restaurantForEdit = {}" />
            <b-button :disabled="!file.name" label="Edit image" type="is-primary" @click="editImage" />
          </footer>
        </div>
      </b-modal>

      <b-modal
        v-model="changeOwnerModal"
        has-modal-card
        trap-focus
        :destroy-on-hide="true"
        aria-role="dialog"
        aria-label="Edit Restaurant Image"
        aria-modal
      >
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              Change Restaurant Owner
            </p>
            <button type="button" class="delete" @click="changeOwnerModal = false; restaurantForEdit = {}" />
          </header>
          <section class="modal-card-body">
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
          </section>
          <footer class="modal-card-foot">
            <b-button label="Close" @click="changeOwnerModal = false; restaurantForEdit = {}" />
            <b-button :disabled="!userId" label="Edit owner" type="is-primary" @click="ChangeRestaurantOwner" />
          </footer>
        </div>
      </b-modal>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AllRestaurantsPage',
  layout: 'admin',
  data () {
    return {
      isLoading: true,
      file: {},
      userName: '',
      userId: '',
      restaurantId: '',
      restaurantForEdit: {},
      isCardModalActive: false,
      changeOwnerModal: false,
      restaurants: [],
      users: []
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
  async mounted () {
    try {
      await this.getRestaurants()
      this.users = await this.$axios.$get('/users')
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
    }
  },
  methods: {
    async ChangeRestaurantOwner () {
      try {
        await this.$axios.$post('/restaurants/change/restAdmin', { newUserId: this.userId, restaurantId: this.restaurantId })
        this.restaurants.forEach((rest) => {
          if (rest._id === this.restaurantId) { rest.owner = this.userId }
        })
        this.$forceUpdate()
        this.userName = ''
        this.userId = ''
        this.restaurantId = ''
        this.restaurantForEdit = {}
        this.changeOwnerModal = false
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Owner Changed', type: 'success' })
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
    },
    async getRestaurants () {
      try {
        const res = await this.$axios.$get('/restaurants')
        this.restaurants = res
        this.isLoading = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
    },
    async editImage () {
      if (!this.file.name) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Please choose image' })
        return
      }
      const formdata = new FormData()
      formdata.append('img', this.file)
      try {
        const imgRes = await this.$axios.$post('/image/', formdata)
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Image uploaded successfully', type: 'info' })
        await this.$axios.$patch(`/restaurants/${this.restaurantForEdit._id}`, { img: imgRes })
        this.restaurants.forEach((d) => {
          if (d._id === this.restaurantForEdit._id) {
            d.img = imgRes
          }
        })
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Dish image updated', type: 'success' })
        this.isCardModalActive = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
    },
    deleteRestaurant (id) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Restaurant',
        message: 'Are you sure you want to <b>delete</b> this restaurant? This action cannot be undone.',
        confirmText: 'Delete Restaurant',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          await this.$axios.$delete(`/restaurants/${id}`)
          await this.getRestaurants()
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Restaurant Deleted successfully', type: 'success' })
        }
      })
    }
  }
}
</script>

<style  scoped>

</style>
