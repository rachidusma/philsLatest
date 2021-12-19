<template>
  <div class="card">
    <div class="card-content">
      <p :id="subtitle" class="title">
        0
      </p>
      <p class="subtitle">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subtitle: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setAnimation(this.subtitle)
    })
  },
  methods: {
    setAnimation (selector) {
      this.$anime({
        targets: `#${selector}`,
        innerHTML: [0, this.count],
        easing: 'linear',
        round: 1
      })
    }
  }
}
</script>

<style scoped>

</style>
