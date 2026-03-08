<script setup lang="ts">
import type { PropType } from 'vue'
import type { ItemData, CartItem } from '~/types/data'
import { useDate } from 'vuetify'

enum ITEM_ACTION {
  ADD = 'add',
  REMOVE = 'remove',
}

type ActionChoices = `${ITEM_ACTION}`
const { addItem, removeItem, getItemQuantity } = useCartStore()
const uiStore = useUiStore()
const isGlobalLoad = computed(() => uiStore.isLoading)
const emit = defineEmits(['update:restock'])
const props = defineProps({
  id: {
    type: String,
    default: 'item-box',
  },
  item: {
    type: Object as PropType<ItemData>,
    default: () => ({
      item_hash: '#',
      item_image: '',
      item_name: 'Item',
      item_stock: 0,
      item_price: 0,
    }),
  },
})
const itemData = computed(() => props.item)
const isEmptyStock = computed(() => itemData.value.item_stock === 0)
const itemCount = computed(() => getItemQuantity(itemData.value.item_hash))
const emptyCount = computed(() => itemCount.value === 0)
const maxItemCount = computed(() => itemCount.value === itemData.value.item_stock)

const itemHandler = (action: ActionChoices) => {
  if (itemData.value.item_stock > itemCount.value && action === ITEM_ACTION.ADD) {
    addItem(itemData.value)
  } else if (itemCount.value > 0 && action === ITEM_ACTION.REMOVE) {
    removeItem(itemData.value.item_hash)
  }
}

const timer = ref<ReturnType<typeof setInterval>>()
const dateAdapter = useDate()
const countdown = ref('')
function updateRestockCountdown() {
  // ## Note ## Add some delay here to avoid refresh data before scheduler in backend
  const RESTOCK_DELAY_SEC = 10
  if (itemData.value.restock_at) {
    const now = dateAdapter.date() as Date
    const restockDate = dateAdapter.date(
      new Date((itemData.value.restock_at + RESTOCK_DELAY_SEC) * 1000)
    ) as Date
    const diffMs = restockDate.getTime() - now.getTime()

    if (diffMs <= 0) {
      countdown.value = ''
      clearInterval(timer.value)
      emit('update:restock', itemData.value.item_hash)

      return
    }

    const totalSeconds = Math.floor(diffMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const parts: string[] = []
    if (hours > 0) parts.push(`${hours}hrs`)
    if (minutes > 0) parts.push(`${minutes}mins`)
    parts.push(`${seconds}sec`)

    countdown.value = `Restock in ${parts.join(' ')}`
  }
}
function startInterval() {
  clearInterval(timer.value)
  updateRestockCountdown()
  timer.value = setInterval(updateRestockCountdown, 1000)
}
watch(
  itemData,
  (newVal) => {
    if (!newVal?.restock_at) {
      clearInterval(timer.value)
      countdown.value = ''
      return
    }
    startInterval()
  },
  { deep: true }
)

// Start on client only
onMounted(() => {
  if (itemData.value?.restock_at) {
    startInterval()
  }
})

onUnmounted(() => clearInterval(timer.value))
</script>

<template>
  <v-card :id="props.id" class="item-box pa-4" width="100%" min-height="100px">
    <v-row>
      <v-col cols="4">
        <v-responsive width="100%" height="100%">
          <v-img :src="item.item_image" width="100%" height="100%" cover :aspect-ratio="1 / 1">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height bg-light-blue">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-responsive>
        <!-- <v-avatar size="128" tile color="primary"> </v-avatar> -->
      </v-col>
      <v-col cols="8">
        <div class="item-detail d-flex flex-column justify-center align-start flex-grow-1">
          <div class="item-title-wrapper flex-grow-1 w-100">
            <v-card-title class="py-1 px-0">
              {{ item.item_name }}
            </v-card-title>
            <v-card-subtitle class="mb-2 px-0"
              >฿{{ currencyFormatter(item.item_price) }}</v-card-subtitle
            >
          </div>
          <div v-if="isEmptyStock" class="item-out-of-stock-wrapper d-flex flex-column justify-end">
            <p v-if="countdown" class="my-0 text-label-small text-orange">
              <span>{{ countdown }}</span>
            </p>
            <p class="my-0 text-grey">Out of Stock</p>
          </div>
          <div
            v-else
            class="item-handler-wrapper w-100 d-flex justify-space-between align-end flex-grow-1 ga-2"
          >
            <v-btn
              color="primary"
              height="48"
              :disabled="emptyCount || isGlobalLoad"
              :loading="isGlobalLoad"
              @click="itemHandler(ITEM_ACTION.REMOVE)"
              ><v-icon icon="mdi-minus"
            /></v-btn>
            <v-text-field
              :model-value="itemCount"
              type="number"
              readonly
              class="item-counter flex-grow-1"
              hide-details
            />
            <v-btn
              color="primary"
              height="48"
              :disabled="maxItemCount || isGlobalLoad"
              :loading="isGlobalLoad"
              @click="itemHandler(ITEM_ACTION.ADD)"
            >
              <v-icon icon="mdi-plus" />
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style lang="scss">
$actionHandlerHeight: 48px;
.item-counter {
  height: $actionHandlerHeight !important;
}
.item-out-of-stock-wrapper {
  height: $actionHandlerHeight;
}
</style>
