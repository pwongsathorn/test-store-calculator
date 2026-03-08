<script setup lang="ts">
import type { CartItem, OrderSummary, CalculatePayload } from '~/types/data'

const cartStore = useCartStore()
const purchaseStore = usePurchaseStore()
const uiStore = useUiStore()
const sessionStore = useSessionStore()
const session_id = computed(() => sessionStore.shop_session.session_id)
const empyState = computed(() => cartStore.isEmpty)

const payload = computed<CalculatePayload>(() => cartStore.cartData)
const config = useRuntimeConfig()
const orderSummary = ref<OrderSummary | undefined>(undefined)

// const { data: orderSummary, refresh } = await useAsyncData<OrderSummary>('post-calculation', () =>
//   $fetch<OrderSummary>(`${config.public.apiBase}/post-calculation`, {
//     method: 'POST',
//     body: payload.value,
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: session_id.value,
//     },
//     onRequest: () => {
//       cartStore.updateCartLoadState(true)
//     },
//     onResponse: () => {
//       cartStore.updateCartLoadState(false)
//     },
//     onResponseError: () => {
//       cartStore.updateCartLoadState(false)
//     },
//     onRequestError: () => {
//       cartStore.updateCartLoadState(false)
//     },
//   })
// )

watch(
  payload,
  () => {
    calculateCart()
  },
  { immediate: false, deep: true }
)
const isLoadingState = computed(() => uiStore.isLoading)
async function calculateCart() {
  cartStore.updateCartLoadState(true)
  await $fetch<OrderSummary>(`${config.public.apiBase}/post-calculation`, {
    method: 'POST',
    body: payload.value,
    headers: {
      'Content-Type': 'application/json',
      Authorization: session_id.value,
    },
  })
    .then((data) => {
      console.log('calculated!')
      if (data) {
        orderSummary.value = data
      }
    })
    .catch((err) => {
      console.error('error', err)
    })
    .finally(() => {
      cartStore.updateCartLoadState(false)
    })
}
const successDialog = ref(false)
const errorDialog = reactive({
  state: false,
  text: '',
})
async function makePurchase() {
  uiStore.toggleLoader()
  await $fetch<OrderSummary>(`${config.public.apiBase}/post-purchase`, {
    method: 'POST',
    body: payload.value,
    headers: {
      'Content-Type': 'application/json',
      Authorization: session_id.value,
    },
  })
    .then((data) => {
      console.log('purchase success!', orderSummary)
      if (data) {
        setTimeout(() => {
          purchaseStore.addPurchaseList(session_id.value, data)
          cartStore.clearCart()
          successDialog.value = true
        }, 500)
      }
    })
    .catch((err) => {
      console.error('error', err)
      errorDialog.state = true
      errorDialog.text = err.message
    })
    .finally(() => {
      uiStore.toggleLoader()
    })
}
</script>

<template>
  <v-container fluid class="cart-content pa-0 fill-height d-flex flex-column">
    <v-dialog v-model="successDialog" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-check-decagram"
        text="Thank you for shopping with us. we'll start your shipping as soon as possible!"
        title="Your purchase is complete."
      >
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Ok" @click="successDialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errorDialog.state" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-check-decagram"
        :text="errorDialog.text"
        title="An Error Occurs"
      >
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Ok" @click="errorDialog.state = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <section class="item-list-section flex-grow-1 px-4 py-2 d-flex flex-column">
      <template v-if="cartStore.calculating">
        <p>Loading</p>
      </template>
      <template v-else-if="empyState">
        <p class="text-grey">Your Cart is Empty</p>
      </template>
      <template v-else>
        <div class="item-wrapper flex-grow-1">
          <li class="item-list px-0">
            <ol
              class="item pa-0 my-0 mb-2 d-flex justify-space-between"
              v-for="(item, cartIndex) in orderSummary?.breakdown"
              :key="`cart-item-${cartIndex}`"
            >
              <p>
                <span class="item-name">{{ item.item_name }}</span>
                <span class="px-1">x</span>
                <span>
                  {{ numberFormatter(item.quantity) }}
                </span>
              </p>
              <p class="flex-grow-1 text-right">
                <template v-if="item.pair_total">
                  <span class="item-price text-label-small text-grey text-decoration-line-through"
                    >฿{{ currencyFormatter(item.unit_price * item.quantity) }}</span
                  >
                </template>
                <strong class="item-price">฿{{ currencyFormatter(item.total) }}</strong>
              </p>
            </ol>
          </li>
        </div>
        <v-divider />
        <div v-if="orderSummary" class="summarize-detail">
          <p class="sub-total">
            <span class="item-name">Sub-total</span>
            <span>
              <strong class="item-price"> ฿{{ currencyFormatter(orderSummary.subtotal) }} </strong>
            </span>
          </p>
          <p v-if="orderSummary.member_discount" class="member-discount">
            <v-chip color="teal" tile class="item-name">10% Member Discount</v-chip>
            <span>
              <strong class="item-price text-grey">
                -฿
                {{ currencyFormatter(orderSummary.member_discount) }}
              </strong>
            </span>
          </p>
          <v-divider />
          <p class="grand-total text-title-large">
            <span class="item-name">Grand Total</span>
            <span>
              <strong class="item-price">
                ฿
                {{ currencyFormatter(orderSummary.grand_total) }}
              </strong>
            </span>
          </p>
        </div>
      </template>
    </section>
    <v-divider />
    <section class="action-section pa-4">
      <v-btn
        height="48"
        block
        color="primary"
        :disabled="empyState || isLoadingState"
        @click="makePurchase"
      >
        <span class="text-uppercase">Purchase</span>
      </v-btn>
    </section>
  </v-container>
</template>

<style lang="scss">
.cart-content {
  .item-wrapper {
    li.item-list {
      list-style-type: none;
    }
  }
  .summarize-detail {
    p {
      padding: 8px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
