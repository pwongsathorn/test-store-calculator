<script setup lang="ts">
const titleText = ref('Calculator')
</script>

<template>
  <v-app-bar flat density="compact" color="primary">
    <v-app-bar-title>{{ titleText }}</v-app-bar-title>
    <v-spacer></v-spacer>
  </v-app-bar>

  <v-divider></v-divider>
</template>
