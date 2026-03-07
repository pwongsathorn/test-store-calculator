<template>
  <v-container class="fill-height" max-width="900">
    <v-form v-model="isFormValid" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="username"
            label="Username"
            :rules="usernameRules"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            :rules="passwordRules"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12">
          <v-btn type="submit" color="blue" height="56px" block tile>SIGN IN</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const isFormValid = ref(false)

const username = ref<string>('')
const password = ref<string>('')

const usernameRules = [(val: string) => !!val || 'Username is Required']
const passwordRules = [(val: string) => !!val || 'Password is Required']
const submitForm = async () => {
  const payload = {
    username: username.value,
    password: password.value,
  }

  console.log('submit payload', payload)
  const res = await fetch('http://localhost:3300/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
</script>
