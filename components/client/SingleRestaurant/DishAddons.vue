<template>
  <div class="addons">
    <div class="my-3 p-3 addons-header">
      {{ $t('orderPage.extraAddons') }} {{ dishTitle }}
    </div>

    <b-collapse
      v-for="(addon, idx) in allAddons"
      :key="addon.title"
      v-model="allAddons[idx].checked"
      aria-id="contentIdForA11y2"
      class="panel"
      animation="slide"
      @open="dishChoosed(addon, 'add', idx)"
      @close="dishChoosed(addon, 'delete', idx)"
    >
      <template #trigger>
        <div class="p-3 addons-single is-flex is-align-items-center">
          <b-checkbox v-model="allAddons[idx].checked" disabled />
          <span class="is-flex-grow-1">{{ addon.title }}</span>
          <p>+ {{ addon.price }} kr</p>
        </div>
      </template>

      <div class="pb-2 is-flex is-justify-content-flex-end">
        <b-numberinput v-model="allAddons[idx].amount" min="0" type="is-light" @input="IChanged($event,addon, idx)" />
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: 'DishAddons',
  props: {
    dishTitle: {
      type: String,
      default: () => ''
    },
    addons: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      number: 1,
      checked: false,
      totalPrice: 0,
      allAddons: [],
      choosedAddons: []
    }
  },
  computed: {
    price () {
      return this.choosedAddons
        .reduce((sum, addon) => { return sum + (addon.price * addon.amount) }, 0)
    }
  },
  watch: {
    addons: {
      immediate: true,
      handler (newValue) {
        if (newValue) {
          this.allAddons = JSON.parse(JSON.stringify(newValue))
          this.allAddons.forEach((addon) => {
            addon.checked = false
            addon.amount = 0
          })
        }
      }
    }
  },
  destroyed () {
    this.choosedAddons = []
    this.totalPrice = 0
    this.$emit('addonsPriceChanged', 0)
  },
  methods: {
    dishChoosed (addon, type, idx) {
      const item = this.allAddons[idx]
      const addonObj = { title: addon.title, price: addon.price, amount: addon.amount }
      if (type === 'add') {
        console.log('dsa')
        item.amount = 1
        addonObj.amount = 1
        this.choosedAddons.push(addonObj)
      } else if (type === 'delete') {
        const idx = this.choosedAddons.findIndex(choosedAddon => choosedAddon.title === addonObj.title)
        this.choosedAddons.splice(idx, 1)
        item.amount = 0
      }
      this.editPrice()
    },
    editPrice () {
      this.totalPrice = this.choosedAddons
        .reduce((sum, addon) => { return sum + (addon.price * addon.amount) }, 0)
      this.$emit('addonsPriceChanged', { price: this.totalPrice, addons: this.choosedAddons })
    },
    IChanged (nom, orginalAddon, idx) {
      const addon = this.choosedAddons.find(val => val.title === orginalAddon.title)
      if (addon) { addon.amount = nom } else {
        this.allAddons[idx].checked = true
        orginalAddon.amount = nom
        this.choosedAddons.push(orginalAddon)
      }
      this.editPrice()
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
