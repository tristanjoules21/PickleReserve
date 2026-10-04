<script setup>
import { ref } from "vue";
import LoginInput from "./LoginInput.vue";

const emit = defineEmits(["submit"]);
const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);

function submitRegister() {
  emit("submit", {
    name: name.value,
    email: email.value,
    password: password.value
  });
}
</script>

<template>
  <form class="register-form" @submit.prevent="submitRegister">
    <LoginInput v-model="name" label="Full name" icon="♙" placeholder="Alex Morgan" />
    <LoginInput v-model="email" label="Email" icon="✉" type="email" placeholder="you@email.com" />
    <LoginInput
      v-model="password"
      label="Password"
      icon="🔒"
      type="password"
      placeholder="••••••••"
      toggleable
      :show-password="showPassword"
      @toggle="showPassword = !showPassword"
    />
    <button class="primary-button" type="submit">Create Account</button>
  </form>
</template>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.primary-button {
  width: 100%;
  margin-top: 2px;
  border: 0;
  border-radius: 12px;
  padding: 14px 20px;
  background: #16a34a;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(22, 163, 74, 0.18);
}

.primary-button:hover {
  background: #15803d;
}
</style>
