<script lang="ts" setup>
import ItemList from '~/components/ItemList.vue'
const uiStore = useUiStore()
const calcHeight = computed(() => uiStore.calcFooterHeight)
</script>

<template>
  <v-container
    max-width="1200"
    class="item-contents pb-md-4 h-100"
    :style="{ paddingBottom: calcHeight }"
  >
    <h2 class="text-center">Product List</h2>
    <ItemList />
  </v-container>
</template>
