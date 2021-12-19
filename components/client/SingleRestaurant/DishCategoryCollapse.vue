<template>
  <div class="my-1">
    <b-collapse
      :id="`collapse-${title}`"
      v-model="isOpen"
      :aria-id="title"
      class="panel"
      animation="slide"
      @open="changeState(`collapse-${title}`, 'open')"
      @close="changeState('close')"
    >
      <template #trigger>
        <div
          class="panel-heading"
          role="button"
          :aria-controls="title"
        >
          <img
            :src="img"
            alt="dish-placeholder"
          >
          <strong>{{ title }}</strong>
        </div>
      </template>

      <div class="panel-block">
        <!-- Start Cards -->
        <div class="columns">
          <div v-for="card in dishes" :key="card._id" class="column is-6-tablet is-12-mobile">
            <dish-card :dish="card" @openModal="cardClicked(card)" />
          </div>
        </div>
        <!-- End cards -->
      </div>
    </b-collapse>

    <dish-modal :key="modalKey" :is-open="dishModalOpen" :dish="currentDish" @closed="dishModalOpen = false; currentDish = null" />
  </div>
</template>

<script>
import DishCard from './DishCard.vue'
import DishModal from './DishModal.vue'
export default {
  name: 'DishCategory',
  components: { DishCard, DishModal },
  props: {
    state: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ''
    },
    img: {
      type: String,
      default: () => ''
    },
    dishes: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isOpen: false,
      modalKey: 0,
      currentDish: null,
      dishModalOpen: false
    }
  },
  watch: {
    state (val) {
      this.isOpen = val
      if (val) {
        // document.getElementById(`collapse-${this.title}`).scrollIntoView()
        this.$emit('openType')
        const elemnetTop = document.getElementById(`collapse-${this.title}`).getClientRects()[0].top
        window.scrollBy({
          top: elemnetTop - 75,
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  },
  methods: {
    changeState (id, type) {
      if (type === 'open') {
        this.$emit('openType')
      } else {
        this.$emit('closeType')
      }
    },
    cardClicked (dish) {
      this.modalKey++
      this.$nextTick(() => {
        this.currentDish = dish
        this.dishModalOpen = true
      })
    }
  }

}
</script>

<style scoped>
.panel-heading {
  display: flex;
  align-items: center;
  background: #fff;
  margin-bottom: 10px;
}

.panel-heading img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.panel-block {
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

</style>
