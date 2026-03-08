<script lang="ts" setup>
const cartStore = useCartStore()
const uiStore = useUiStore()
const isMemberValid = ref(false)
const member_card_number = ref<string>('')
const member_rules = [
  (value: string) => {
    if (value) return true

    return 'Member is Required'
  },
]
const updateMemberCard = () => {
  console.log('update member ===:', member_card_number.value)
  cartStore.updateMember(member_card_number.value)
}

const clearMember = () => {
  cartStore.updateMember('')
  member_card_number.value = ''
}
const calcHeight = computed(() => uiStore.calcFooterHeight)
const empyCart = computed(() => cartStore.isEmpty)
</script>

<template>
  <v-app-bar
    class="footer-app-bar"
    location="bottom"
    :flat="$vuetify.display.mdAndUp"
    :height="calcHeight"
  >
    <v-container class="d-flex flex-column justify-end fill-height" fluid>
      <section class="member-code w-100 mb-4 mb-md-0">
        <v-form v-model="isMemberValid" @submit.prevent="updateMemberCard">
          <v-row>
            <v-col cols="12">
              <p>
                <v-chip
                  :variant="cartStore.cartData.member_code ? 'tonal' : 'text'"
                  :class="{ 'text-teal': cartStore.cartData.member_code }"
                  tile
                  :prepend-icon="cartStore.cartData.member_code ? 'mdi-check-decagram' : ''"
                >
                  <span v-if="cartStore.cartData.member_code">
                    Congrat!
                    <strong class="px-1">Member {{ cartStore.cartData.member_code }},</strong>
                    your 10% discount was applied!
                  </span>
                  <span v-else>Get 10% Discount for Member</span>
                </v-chip>
                <v-btn
                  v-if="cartStore.cartData.member_code"
                  color="grey"
                  icon="mdi-close"
                  @click="clearMember"
                />
              </p>
            </v-col>
            <template v-if="!cartStore.cartData.member_code">
              <v-col cols="8">
                <v-text-field
                  :label="member_card_number ? 'Member Card' : 'Your Member Card Number...'"
                  v-model="member_card_number"
                  :rules="member_rules"
                  class="member-input"
                  hide-details
                />
              </v-col>
              <v-col cols="4">
                <v-btn
                  class="member-submit-btn"
                  color="primary"
                  variant="flat"
                  type="submit"
                  :disabled="!isMemberValid"
                  block
                  height="48"
                >
                  GET DISCOUNT
                </v-btn>
              </v-col>
            </template>
          </v-row>
        </v-form>
      </section>

      <section class="d-block d-md-none checkout-section w-100">
        <v-btn
          variant="flat"
          height="72"
          color="primary"
          block
          @click="uiStore.toggleCartMenu"
          :disabled="empyCart"
        >
          CHECKOUT
        </v-btn>
      </section>
    </v-container>
  </v-app-bar>
</template>

<style lang="scss">
@use 'vuetify/settings' as variable;
@use 'sass:map';
$inputHeight: 48px;
@media #{map.get(variable.$display-breakpoints, 'sm-and-down')} {
  .footer-app-bar {
    position: fixed !important;
    bottom: 0px !important;
    left: 0px !important;
    right: 0px !important;
  }
}
.member-input {
  height: $inputHeight !important;
}
</style>
