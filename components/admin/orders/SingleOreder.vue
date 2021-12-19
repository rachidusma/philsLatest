<template>
  <b-collapse
    class="card"
    animation="slide"
    aria-id="contentIdForA11y3"
  >
    <template #trigger="props">
      <header class="card-header">
        <div v-if="order.date" class="card-header-title is-flex is-justify-content-space-between is-align-items-center">
          <p class="my-0 is-size-5">
            Date: {{ $dayjs(order.date).format('YYYY/MM/DD HH:MM') }}, state: {{ order.orderState }}
          </p>
          <h3 class="my-0 is-size-5">
            Total: {{ order.total }} Kr
            <b-icon
              :icon="props.open ? 'menu-down' : 'menu-up'"
            />
          </h3>
        </div>
      </header>
    </template>

    <div class="card-content">
      <ul>
        <li class="mb-3">
          <p class="m-0 p-0">
            User Info:
          </p>
          <p class="m-0 p-0">
            name: {{ order.user.name }}
          </p>
          <p class="m-0 p-0">
            Location: {{ order.user.location || 'Not provided' }}
          </p>
          <p class="m-0 p-0">
            phone: {{ order.user.phone }}
          </p>
          <p class="m-0 p-0">
            email: {{ order.user.email }}
          </p>
        </li>
        <li class="mb-3">
          Order created At: {{ $dayjs(order.date).format('YYYY/MM/DD HH:MM') }}
        </li>
        <li>
          <p>Place {{ order.delivery }}</p>
        </li>
        <li class="mb-3">
          <p>State:</p>
          <b-select v-model="order.orderState">
            <option value="placed">
              Placed
            </option>
            <option value="review">
              In Review
            </option>
            <option value="delivered">
              Delivered
            </option>
          </b-select>
        </li>
        <li class="mb-3">
          <p>Items:</p>
          <div v-for="item in order.items" :key="item._id" class="is-bordered order-item">
            <header class="is-flex is-justify-content-space-between is-align-items-center">
              <h3 class="is-size-5">
                {{ item.amount }} X {{ item.dish }}
              </h3>

              <h3 class="is-size-5">
                {{ item.price }} Kr
              </h3>
            </header>

            <div class="order-item__content">
              <!-- Flavours -->
              <details open>
                <summary>
                  <span class="is-size-5">
                    <b>Flavour: </b>
                  </span>
                </summary>
                <div class="mt-3 is-flex is-justify-content-space-between is-align-items-center">
                  <p class="has-text-weight-bold">
                    {{ item.flavour.title.title }}
                  </p>
                  <p class="has-text-weight-bold">
                    {{ item.flavour.title.price }} Kr
                  </p>
                </div>
              </details>
              <!-- Addons -->
              <details open>
                <summary>
                  <span class="is-size-5">
                    <b>Addons: </b>
                  </span>
                </summary>
                <div v-for="addon in item.addons.items" :key="addon._id" class="mt-3 is-flex is-justify-content-space-between is-align-items-center">
                  <p class="has-text-weight-bold">
                    {{ addon.amount }} X {{ addon.title }}
                  </p>
                  <p class="has-text-weight-bold">
                    {{ addon.amount }} X {{ addon.price }} = {{ addon.price * addon.amount }} Kr
                  </p>
                </div>
              </details>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </b-collapse>
</template>

<script>
export default {

}
</script>

<style>

</style>
