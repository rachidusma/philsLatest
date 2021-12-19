<template>
  <div class="content">
    <section class="mt-5 container">
      <div class="mt-5 mb-4 is-flex is-justify-content-space-between is-align-items-center">
        <h3>{{ $t('cate.All categories') }}:</h3>
        <b-button type="is-info" icon-right="plus" @click="isCardModalActive = true">
          {{ $t('cate.Add new category') }}
        </b-button>
      </div>
      <b-table
        :data="categories"
        hoverable
        :loading="isLoading"
      >
        <b-table-column v-slot="props" searchable field="title" :label="$t('cate.Name')">
          {{ props.row.title }}
        </b-table-column>

        <b-table-column v-slot="props" searchable field="restaurant.title" :label="$t('cate.Restaurant')">
          {{ props.row.restaurant.title }}
        </b-table-column>

        <b-table-column v-slot="props">
          <b-button type="is-danger" size="is-small" icon-right="delete" @click="deleteCategory(props.row._id)" />
          <b-button type="is-warning" size="is-small" icon-right="square-edit-outline" @click="openEdit(props.row)" />
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">
            {{ $t('cate.No Categories Yet') }}
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
        @close="resetModal"
      >
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              {{ edit ? $t('cate.Edit') : $t('cate.Add') }} {{ $t('cate.Category') }}
            </p>
            <button type="button" class="delete" @click="resetModal" />
          </header>
          <section class="modal-card-body">
            <b-field :label="$t('cate.Category name')">
              <b-input v-model="title" />
            </b-field>

            <b-field v-if="$auth.user && $auth.user.role !== 'Restaurant Owner'" class="py-6" :label="$t('cate.Choose restaurant for category')">
              <b-autocomplete
                v-model="restaurantName"
                :clear-on-select="false"
                :data="filteredDataArray"
                field="title"
                :placeholder="$t('cate.Enter restaurant name')"
                icon="magnify"
                @select="option => { option ? restaurantId = option._id : null }"
              >
                <template slot-scope="props">
                  {{ props.option.title }}
                </template>

                <template #empty>
                  {{ $t('cate.No restaurant found') }}
                </template>
              </b-autocomplete>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button :label="$t('cate.Close')" @click="resetModal" />
            <b-button :disabled="!title || !restaurantName" type="is-primary" @click="addCategory">
              {{ edit ? $t('cate.Edit') : $t('cate.Add') }}
            </b-button>
          </footer>
        </div>
      </b-modal>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AllCategoriesPage',
  layout: 'admin',
  data () {
    return {
      isLoading: true,
      edit: false,
      title: '',
      id: '',
      isCardModalActive: false,
      addBtnLoading: false,
      restaurantName: '',
      editBtnLoading: false,
      categories: [],
      restaurantId: '',
      restaurants: []
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
  async mounted () {
    try {
      this.restaurants = await this.$axios.$get('/restaurants')
      await this.getCategories()
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: this.$t('errors.There was an error while getting restaurants!') })
    }
  },
  methods: {
    async getCategories () {
      try {
        if (this.$auth.user.role === 'admin') {
          const res = await this.$axios.$get('/categories')
          this.categories = res
        } else if (this.$auth.user.role === 'Restaurant Owner') {
          this.categories = await this.$axios.$get(`categories/filter/${this.$auth.user.restaurantId}`)
        }
        this.isLoading = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
    },
    resetModal () {
      this.edit = false
      this.id = ''
      this.title = ''
      this.restaurantId = this.$auth.user.role === 'Restaurant Owner' ? this.$auth.user.restaurantId : ''
      this.restaurantName = this.$auth.user.role === 'Restaurant Owner' ? this.restaurants.find(x => x._id === this.$auth.user.restaurantId).title : ''

      this.isCardModalActive = false
    },
    openEdit (cate) {
      this.edit = true
      this.id = cate._id
      this.title = cate.title
      if (this.$auth.user.role !== 'Restaurant Owner') {
        const re = this.restaurants.find(x => x._id === cate.restaurant)
        this.restaurantId = re ? cate.restaurant : ''
        this.restaurantName = re ? re.title : ''
      }

      this.isCardModalActive = true
    },
    deleteCategory (id) {
      this.$buefy.dialog.confirm({
        title: this.$t('cate.Deleting Category'),
        message: this.$t('cate.Are you sure you want to <b>delete</b> this category? This action cannot be undone.'),
        confirmText: this.$t('cate.Delete Category'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          await this.$axios.$delete(`/categories/${id}`)
          await this.getCategories()
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: this.$t('cate.Category Deleted successfully'), type: 'success' })
        }
      })
    },
    async addCategory () {
      this.addBtnLoading = true
      this.restaurantId = this.$auth.user.role === 'Restaurant Owner' ? this.$auth.user.restaurantId : this.restaurantId
      try {
        if (!this.edit) {
          await this.$axios.post('/categories', { title: this.title, restaurant: this.restaurantId })
        } else {
          await this.$axios.patch(`/categories/${this.id}`, { title: this.title })
        }
        await this.getCategories()
        this.resetModal()
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: this.$t('cate.Category added successfully'), type: 'success' })
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err.response.data.msg })
      }
      this.addBtnLoading = false
    }
  }
}
</script>

<style  scoped>

</style>
