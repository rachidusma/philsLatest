<template>
  <header class="py-1">
    <div class="container">
      <!-- <div class="is-hidden-touch mb-3">
        <h4 class="is-size-4">
          Meny 1-24
        </h4>
        <span
          aria-roledescription="paragraph"
          style="border-bottom: 2px solid rgb(56, 161, 105)"
          class="p-0 m-0"
        >
          12:00-12:00
        </span>
      </div> -->
      <div class="mb-2">
        <div v-if="showCarousel">
          <b-carousel-list
            v-model="values"
            :data="types"
            arrow
            :arrow-hover="false"
            class="is-hidden-desktop"
            :items-to-list="1"
            :items-to-show="3.5"
            :icon-size="'is-meduim'"
            has-drag
          >
            <template #item="list">
              <div>
                <b-button
                  class="mr-2"
                  :label="list.title"
                  type="is-text"
                  size="is-meduim"
                  :aria-controls="list.title"
                  @click="toggleType(list.index)"
                />
              </div>
            </template>
          </b-carousel-list>
        </div>

        <div v-else>
          <b-button
            v-for="(toggle, idx) in types"
            :key="toggle.title + idx"
            class="mr-2"
            :label="toggle.title"
            type="is-text"
            size="is-small"
            :aria-controls="toggle.title"
            @click="toggleType(idx)"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showCarousel: true,
      values: 1
    }
  },
  mounted () {
    this.determineWhatToShow()
    window.addEventListener('resize', this.determineWhatToShow)
  },
  methods: {
    determineWhatToShow () {
      const width = window.innerWidth
      if (width < 1024) {
        this.showCarousel = true
      } else {
        this.showCarousel = false
      }
    },
    toggleType (idx) {
      this.$emit('toggleState', idx)
    }
  }
}
</script>

<style scoped>
header {
  background-color: rgb(255, 255, 255);
  position: sticky;
  top: 0px;
  z-index: 29;
  box-shadow: rgb(0 0 0 / 10%) 0px 4px 6px -1px,
    rgb(0 0 0 / 6%) 0px 2px 4px -1px;
  color: #718096;
}

.carousel-list.has-shadow {
  box-shadow: none;
}
</style>
