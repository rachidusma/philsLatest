<template>
  <div class="content">
    <section class="mt-5 container">
      <div class="mt-5 mb-4 is-flex is-justify-content-space-between is-align-items-center">
        <h3>All dishes:</h3>
        <b-button type="is-info" icon-right="plus" @click="$router.push('/admin/dishes/new')">
          Add new dish
        </b-button>
      </div>
      <b-table
        :data="dishes"
        hoverable
        :loading="isLoading"
      >
        <b-table-column v-slot="props" searchable field="title" label="Name">
          {{ props.row.title }}
        </b-table-column>

        <b-table-column v-slot="props" searchable field="category.title" label="Category">
          {{ props.row.category.title }}
        </b-table-column>

        <b-table-column v-slot="props" searchable field="category.restaurant.title" label="Restaurant">
          {{ props.row.category.restaurant.title }}
        </b-table-column>

        <b-table-column v-slot="props" field="img" label="Image">
          <img :src="props.row.img" width="70px" :alt="props.row.title">
        </b-table-column>

        <b-table-column v-slot="props" searchable field="gradients" label="gradients">
          {{ props.row.gradients }}
        </b-table-column>

        <b-table-column v-slot="props">
          <b-button type="is-danger" size="is-small" icon-right="delete" @click="deleteDish(props.row._id)" />
          <b-button type="is-warning" size="is-small" icon-right="square-edit-outline" @click="$router.push(`/admin/dishes/edit/${props.row._id}`)" />
          <b-button type="is-warning" size="is-small" icon-right="square-edit-outline" @click="dishForEdit = props.row; isCardModalActive = true">
            Edit image
          </b-button>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">
            No Dishes Yet
          </div>
        </template>
      </b-table>
      <b-modal
        v-model="isCardModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-label="Example Modal"
        aria-modal
      >
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              Edit Image
            </p>
            <button type="button" class="delete" @click="isCardModalActive = false; dishForEdit = {}" />
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
            <b-button label="Close" @click="isCardModalActive = false; dishForEdit = {}" />
            <b-button label="Edit image" type="is-primary" @click="editImage" />
          </footer>
        </div>
      </b-modal>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AllDishesPage',
  layout: 'admin',
  data () {
    return {
      isLoading: true,
      file: {},
      dishForEdit: {},
      isCardModalActive: false,
      dishes: []
    }
  },
  async mounted () {
    await this.getDishes()
  },
  methods: {
    async getDishes () {
      try {
        if (this.$auth.user.role === 'admin') {
          const res = await this.$axios.$get('/dishes')
          this.dishes = res
        } else if (this.$auth.user.role === 'Restaurant Owner') {
          this.dishes = await this.$axios.$get(`/dishes/filter/${this.$auth.user.restaurantId}`)
        }
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
        await this.$axios.$patch(`/dishes/${this.dishForEdit._id}`, { img: imgRes })
        this.dishes.forEach((d) => {
          if (d._id === this.dishForEdit._id) {
            d.img = imgRes
          }
        })
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Dish image updated', type: 'success' })
        this.isCardModalActive = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
    },
    deleteDish (id) {
      this.$buefy.dialog.confirm({
        title: 'Deleting Dish',
        message: 'Are you sure you want to <b>delete</b> this dish? This action cannot be undone.',
        confirmText: 'Delete Dish',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          await this.$axios.$delete(`/dishes/${id}`)
          await this.getDishes()
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Dish Deleted successfully', type: 'success' })
        }
      })
    }
  }
}
</script>

<style  scoped>

</style>
