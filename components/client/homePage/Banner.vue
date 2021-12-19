<template>
  <div v-once class="banner">
    <div class="has-text-centered">
      <img width="170px" src="/PhilsBurger_Logo_Rund_Sv.png" alt="Phils Burger">
      <h2 class="is-size-1 mb-4 has-text-weight-bold">
        {{ $t('homepage.welcome') }}
      </h2>

      <p>{{ $t('homepage.useOur') }}.</p>
    </div>

    <div class="has-text-centered" @click="goToSection">
      <p class="is-size-2 has-text-weight-bold">
        {{ $t('homepage.orderHere') }}
      </p>
      <b-icon class="move" size="is-large" icon="chevron-down" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageBanner',
  methods: {
    goToSection () {
      const section = document.getElementById('restaurants').getClientRects()[0].top
      window.scrollBy({
        top: section,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
.banner {
  background-color: #311B51;
  height: calc(100vh - 70px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  color: #F59C24;
  flex-direction: column;
}

.move {
  transition: all 0.4s ease;
  cursor: pointer;
  animation: go-down 1s infinite;
}

@keyframes go-down {
  0% {
    opacity: 0.4;
    transform: translateY(-30%);
  }

  100% {
    opacity: 1;
    transform: translateY(0%);
  }
}
</style>
