<template>
  <div class="is-flex is-justify-content-space-between is-align-items-center">
    <b-button :type="$i18n.locale === 'sw' ? 'is-link' : 'is-link is-light'" size="is-small" @click="changeLang('sw')">
      <img width="80%" src="@/assets/swf.png" alt="Swedish Language">
    </b-button>
    <b-button :type="$i18n.locale === 'en' ? 'is-link' : 'is-link is-light'" size="is-small" @click="changeLang('en')">
      <img width="80%" src="@/assets/ukf.png" alt="English Language">
    </b-button>
  </div>
</template>

<script>
export default {
  methods: {
    changeLang (lang) {
      this.$i18n.setLocale(lang)
    }
  }
}
</script>

<style scoped>
button * {
  height: 20px;
  width: 20px;
}
</style>
