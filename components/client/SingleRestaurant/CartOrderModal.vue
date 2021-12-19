<template>
  <b-modal
    v-model="cartModalOpen"
    has-modal-card
    trap-focus
    :destroy-on-hide="false"
    aria-role="dialog"
    aria-label="Example Modal"
    aria-modal
    @close="$emit('close')"
  >
    <template #default>
      <div style="width: 100%" class="card p-6">
        <div>
          <div class="is-flex is-align-items-center">
            <span class="step">1</span>
            <span class="has-text-weight-semibold">{{ $t('orderPage.How to eat?') }}</span>
          </div>
          <div class="mt-2">
            <div>
              <b-button :type="delivery === 'Take away' ? 'is-info' : 'is-primary is-light'" @click="changeDelivery('Take away')">
                <i class="ri-shopping-bag-fill mr-1" />
                {{ $t('orderPage.Take away') }}
              </b-button>
              <b-button :type="delivery === 'At restaurant' ? 'is-info' : 'is-primary is-light'" class="ml-2" @click="changeDelivery('At restaurant')">
                <i class="ri-shopping-bag-fill mr-1" />
                {{ $t('orderPage.At restaurant') }}
              </b-button>
            </div>
            <p v-if="days" class="is-size-6 my-2">
              {{ $t('orderPage.today') }}: {{ days.times[0] }} - {{ days.times[1] }}
            </p>
          </div>
        </div>
        <div class="mb-2 is-flex is-align-items-center">
          <span class="step">2</span>
          <span class="has-text-weight-semibold">{{ $t('orderPage.Date and time') }}</span>
        </div>

        <b-field :label="$t('orderPage.date')">
          <b-select v-model="orderDate" :placeholder="$t('orderPage.Pick a date')" expanded>
            <option value="">
              {{ $t('orderPage.Pick a date') }}
            </option>
            <option v-for="date in createDates()" :key="date.text" :value="date.value">
              {{ date.text }}
            </option>
          </b-select>
        </b-field>

        <b-field :label="$t('orderPage.time')">
          <b-select v-model="orderTime" :placeholder="$t('orderPage.Pick a time')" expanded>
            <option value="">
              {{ $t('orderPage.Pick a time') }}
            </option>
            <option v-for="time in createTimes()" :key="time" :value="time">
              {{ time }}
            </option>
          </b-select>
        </b-field>

        <b-button type="is-success" expanded @click="$emit('close', { orderDate, delivery, orderTime })">
          {{ $t('orderPage.Go To Order') }}
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import dayjs from 'dayjs'
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: () => false
    },
    days: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      cartModalOpen: false,
      orderDate: '',
      delivery: 'Take away',
      orderTime: ''
    }
  },
  watch: {
    isOpen (newValue) {
      this.cartModalOpen = newValue
      if (newValue) {
        this.updateInfo()
      }
    }
  },
  methods: {
    createDates () {
      const day = new Date()
      const dates = [
        {
          text: this.$t('orderPage.today'),
          value: dayjs(day).format('DD/MM/YYYY')
        }
      ]
      for (let i = 1; i < 6; i++) {
        const nextDay = new Date(day)
        nextDay.setDate(day.getDate() + i)
        const dayObj = {
          text: dayjs(nextDay).format('dddd DD/MM'),
          value: dayjs(nextDay).format('DD/MM/YYYY')
        }
        dates.push(dayObj)
      }
      return dates
    },
    createTimes () {
      const end = 21
      const start = 12
      const hours = []
      for (let i = start; i <= end - 1; i++) {
        hours.push(`${i}:00`, `${i}:15`, `${i}:30`, `${i}:45`)
      }
      return hours
    },
    changeDelivery (val) {
      this.delivery = val
    },
    updateInfo () {
      const orderInfo = this.$store.getters['localStorage/orderInfo']
      if (orderInfo) {
        this.orderDate = orderInfo.date
        this.delivery = orderInfo.delivery
        this.orderTime = orderInfo.time
      }
    }
  }
}
</script>

<style scoped>
.animation-content {
  width: 100%;
}
span.step {
  height: 30px;
  width: 30px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-block;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  background-color: rgb(226, 232, 240);
  color: rgb(26, 32, 44);
}
</style>
