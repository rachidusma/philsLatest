<template>
  <div>
    <b-button type="is-info" class="mb-3" icon-right="plus" @click="addItem">
      Add
    </b-button>
    <div v-for="(item, idx) in items" :key="item._id" class="is-flex columns is-flex-wrap-wrap is-align-items-end">
      <div class="column is-quarter">
        <b-field :label="`${word} title`">
          <b-input v-model="items[idx].title" :placeholder="`${word} title`" />
        </b-field>
      </div>
      <div class="column is-quarter">
        <b-field :label="`${word} price`">
          <b-input v-model="items[idx].price" type="number" min="0" :placeholder="`${word} price`" />
        </b-field>
      </div>
      <div class="column is-quarter">
        <b-button type="is-danger" icon-right="delete-outline" @click="removeItem(idx)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    word: {
      type: String,
      default: () => ''
    },
    oldItems: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      items: [],
      checked: false
    }
  },
  watch: {
    oldItems (val) {
      if (val.length > 0 && !this.checked) {
        this.items = val
        this.checked = true
      }
    },
    items: {
      immediate: true,
      deep: true,
      handler (newVal) {
        this.$emit('changed', newVal)
      }
    }
  },
  methods: {
    addItem () {
      this.items.push({
        _id: this.items.length + 1,
        title: '',
        price: 0
      })
    },
    removeItem (idx) {
      this.items.splice(idx, 1)
    }
  }
}
</script>

<style  scoped>

</style>
