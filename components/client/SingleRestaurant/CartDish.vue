<template>
  <div class="is-flex is-align-items-stretch columns">
    <div class="column is-one-quarter is-flex is-justify-content-space-between is-align-items-baseline">
      <b-button
        type="is-primary"
        icon-right="minus"
        :disabled="dish.amount <= 1"
        @click="changeDishAmount({ newAmount: dish.amount-1, dishIdx: idx })"
      />
      <p class="is-inline-block px-1">
        {{ dish.amount }}
      </p>
      <b-button
        type="is-primary"
        icon-right="plus"
        @click="changeDishAmount({ newAmount: dish.amount+1, dishIdx: idx })"
      />
      <!-- <b-numberinput :value="dish.amount" @input="changeDishNum($event, dish.title)" /> -->
    </div>
    <div class="column is-two-quarters">
      <div class="flavour is-flex is-justify-content-space-between px-2">
        <h3 class="has-text-black has-text-weight-bold">
          {{ dish.dish }}
        </h3>

        <h3 class="has-text-black has-text-weight-bold">
          {{ dish.price }} kr
        </h3>
      </div>
      <div v-if="dish.flavour.price > 0" class="my-2 flavour is-flex is-justify-content-space-between px-2">
        <p class="has-text-grey">
          {{ $t('orderPage.flavour') }}: {{ dish.flavour.title.title }}
        </p>
        <p class="has-text-grey">
          (+ {{ dish.flavour.price }} kr)
        </p>
      </div>

      <div v-if="dish.addons.price > 0" class="px-2">
        <p class="has-text-grey">
          {{ $t('orderPage.addons') }}:
        </p>
        <div v-for="(addon, idx2) in dish.addons.items" :key="addon.title+idx2" class="my-1 is-flex is-justify-content-space-between">
          <p class="has-text-grey">
            - {{ addon.title }}
          </p>
          <p class="has-text-grey">
            (+ {{ addon.price }} kr)
          </p>
        </div>
      </div>
      <b-button type="is-ghost" @click="removeFromCart({ type: 'remove', item: null, idx })">
        {{ $t('orderPage.Remove From cart') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    dish: {
      type: Object,
      default: () => null
    },
    idx: {
      type: Number,
      default: () => 0
    }
  },
  methods: {
    ...mapActions({
      changeDishAmount: 'localStorage/changeDishAmount',
      editCart: 'localStorage/editCart'
    }),

    removeFromCart (obj) {
      this.$buefy.dialog.confirm({
        message: this.$t('orderPage.You really want to delete the dish?'),
        onConfirm: () => this.editCart(obj)
      })
    }
  }
}
</script>

<style  scoped>

</style>
