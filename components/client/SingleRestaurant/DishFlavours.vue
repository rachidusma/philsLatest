<template>
  <div class="addons">
    <div class="my-3 p-3 addons-header">
      {{ $t('orderPage.flavours') }}
    </div>

    <div v-for="flavour in flavours" :key="flavour.title" class="m-2 is-flex">
      <b-radio
        v-model="checkboxGroup"
        class="is-flex-grow-1"
        :name="flavour.title"
        :native-value="flavour"
        @change.native="editTotalPrice($event, flavour.price)"
      >
        {{ flavour.title }}
      </b-radio>
      <p>{{ flavour.price }} kr</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DishFlavours',
  props: {
    flavours: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      number: 1,
      checked: false,
      totalPrice: 0,
      checkboxGroup: []
    }
  },
  destroyed () {
    this.checkboxGroup = []
    this.totalPrice = 0
    this.$emit('flavourPriceChanged', 0)
    this.number = 1
  },
  methods: {
    editTotalPrice (e, price) {
      this.totalPrice = price
      this.$emit('flavourPriceChanged', { totalPrice: this.totalPrice, flavours: this.checkboxGroup })
    }
  }
}
</script>

<style scoped>
.addons .addons-header {
  background: rgb(226, 232, 240);
  color: black;
}
</style>
