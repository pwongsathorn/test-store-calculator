<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'

import Footer from '@/components/layouts/Footer.vue'
import CartDrawer from '@/components/layouts/CartDrawer.vue'

import CartDialog from '@/components/layouts/CartDialog.vue'
</script>

<template>
  <v-layout height="100%">
    <v-responsive height="100%">
      <Header />
      <v-container fluid class="fill-height pa-0">
        <CartDrawer />
        <CartDialog />
        <v-main height="100%">
          <slot />
          <!-- <div class="fab-wrapper w-100">
          <v-fab
            class="d-block d-md-none w-100"
            color="primary"
            absolute
            location="bottom center"
            size="large"
          >
            Checkout
          </v-fab>
        </div> -->
          <Footer />
        </v-main>
      </v-container>
    </v-responsive>
  </v-layout>
</template>
