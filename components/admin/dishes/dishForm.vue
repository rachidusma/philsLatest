<template>
  <div>
    <form @submit.prevent="addDish">
      <b-field
        :message="!$v.title.required && $v.title.$error ? 'Required' : ''"
        :type="!$v.title.required && $v.title.$error ? 'is-danger' : ''"
        label="Dish name"
      >
        <b-input v-model="title" placeholder="Dish name" />
      </b-field>

      <b-field
        v-if="!editForm"
        :message="!$v.file.required && $v.file.$error ? 'Required' : ''"
        :type="!$v.file.required && $v.file.$error ? 'is-danger' : ''"
        label="Dish image"
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
        :message="!$v.gradients.required && $v.gradients.$error ? 'Required' : ''"
        :type="!$v.gradients.required && $v.gradients.$error ? 'is-danger' : ''"
        label="Dish gradients"
      >
        <b-input v-model="gradients" type="textarea" placeholder="Dish gradients" />
      </b-field>

      <b-field label="Choose dish category">
        <b-autocomplete
          v-model="cateName"
          :clear-on-select="false"
          :data="filteredDataArray"
          field="title"
          placeholder="Enter cate name"
          icon="magnify"
          @select="option => {
            if (option) {
              category = option._id; restaurant = option.restaurant
            }
          }"
        >
          <!-- TODO:  <template #header>
            <a @click="showAddFruit">
              <span> Add new... </span>
            </a>
          </template> -->

          <template #empty>
            No category found
          </template>
        </b-autocomplete>
      </b-field>

      <b-field
        :message="!$v.from.required && $v.from.$error ? 'Required' : ''"
        :type="!$v.from.required && $v.from.$error ? 'is-danger' : ''"
        label="Dish start price"
      >
        <b-input v-model="from" type="number" min="0" placeholder="Dish start price" />
      </b-field>

      <title-and-price-collapse :key="'flav' + resetNo" :old-items="flavours" :title="'Flavours'" @changeItems="flavours = $event" />
      <title-and-price-collapse :key="'addons' + resetNo" :old-items="addons" :title="'Addons'" @changeItems="addons = $event" />

      <b-button
        class="mt-5"
        :disabled="!valid"
        :loading="formBtnLoading"
        expanded
        type="is-success"
        native-type="submit"
      >
        {{ !editForm ? 'Add' : 'Edit' }} Dish
      </b-button>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, requiredUnless, numeric, minValue, minLength } from 'vuelidate/lib/validators'
import TitleAndPriceCollapse from '~/components/admin/dishes/titleAndPriceCollapse.vue'

export default {
  name: 'DishForm',
  components: { TitleAndPriceCollapse },
  mixins: [validationMixin],
  props: {
    oldDish: {
      type: Object,
      default: () => null
    }
  },
  validations: {
    title: { required },
    category: { required },
    file: { requiredUnless: requiredUnless('editForm') },
    gradients: { required },
    from: { required, numeric, minValue: minValue(0) },
    flavours: {
      required,
      minLength: minLength(1),
      $each: {
        title: { required },
        price: { required, numeric }
      }
    },
    addons: {
      required,
      minLength: minLength(1),
      $each: {
        title: { required },
        price: { required, numeric }
      }
    }
  },
  data () {
    return {
      title: '',
      resetNo: 0,
      gradients: '',
      file: {},
      formBtnLoading: false,
      from: 0,
      editForm: false,
      flavours: [],
      addons: [],
      restaurant: '',
      category: '',
      cateName: '',
      categories: []
    }
  },
  computed: {
    filteredDataArray () {
      return this.categories.filter((option) => {
        return this.cateName
          ? option.title
            .toString()
            .toLowerCase()
            .includes(this.cateName.toLowerCase())
          : false
      })
    },
    valid () {
      return (
        this.title &&
        this.gradients &&
        this.from &&
        this.flavours.length >= 1 &&
        this.restaurant._id &&
        this.category
      )
    }
  },
  watch: {
    oldDish (newVal) {
      if (newVal) {
        this.editForm = true
        this.title = newVal.title
        this.gradients = newVal.gradients
        this.from = newVal.from

        const cate = this.categories.find(x => x._id === newVal.category)
        this.category = cate ? newVal.category : ''
        this.restaurant = cate ? newVal.restaurant : ''
        this.cateName = cate ? cate.title : ''
        this.flavours = newVal.flavours
        this.addons = newVal.addons
        // console.log(newVal)
      }
    }
  },
  async mounted () {
    try {
      if (this.$auth.user.role === 'admin') {
        const res = await this.$axios.$get('/categories')
        this.categories = res
      } else if (this.$auth.user.role === 'Restaurant Owner') {
        this.categories = await this.$axios.$get(`categories/filter/${this.$auth.user.restaurantId}`)
      }
    } catch (err) {
      this.$store.dispatch('notify', { $buefy: this.$buefy, message: err })
    }
  },
  methods: {
    removeId () {
      const flavours = JSON.parse(JSON.stringify(this.flavours))
      const addons = JSON.parse(JSON.stringify(this.addons))

      flavours.forEach((flavour) => {
        delete flavour._id
      })
      addons.forEach((flavour) => {
        delete flavour._id
      })
      return { flavours, addons }
    },
    reset () {
      this.title = ''
      this.gradients = ''
      this.category = ''
      this.restaurant = ''
      this.cateName = ''
      this.resetNo++
      this.file = {}
      this.from = 0
      this.flavours = [{ id: 0, title: '', price: 0 }]
      this.addons = []

      this.$v.$reset()
    },
    async addDish () {
      this.formBtnLoading = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        if (this.$v.flavours.$invalid) {
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Please enter valid flavours.' })
        }
        if (this.$v.addons.$invalid) {
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Please enter valid addons.' })
        }
        this.formBtnLoading = false
        return
      }

      try {
        const { flavours, addons } = this.removeId()
        const dish = {
          title: this.title,
          img: null,
          gradients: this.gradients,
          from: this.from,
          category: this.category,
          restaurant: this.restaurant._id,
          flavours,
          addons
        }
        if (!this.editForm) {
          const formdata = new FormData()
          formdata.append('img', this.file)
          const imgRes = await this.$axios.$post('/image/', formdata)
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Image uploaded successfully.', type: 'info' })
          dish.img = imgRes
          await this.$axios.$post('/dishes/', dish)
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Dish created successfully.', type: 'success' })
          this.reset()
        } else {
          delete dish.img
          dish._id = this.oldDish._id
          await this.$axios.$patch(`/dishes/${this.$route.params.id}`, dish)
          this.$store.dispatch('notify', { $buefy: this.$buefy, message: 'Dish edited successfully.', type: 'success' })
          this.$router.push('/admin/dishes')
        }
        this.formBtnLoading = false
      } catch (err) {
        this.$store.dispatch('notify', { $buefy: this.$buefy, message: err, type: 'success' })
        this.formBtnLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
