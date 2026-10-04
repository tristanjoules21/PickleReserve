<script setup>
import { ref } from "vue";
import LoginInput from "./LoginInput.vue";

const emit = defineEmits(["submit"]);
const email = ref("");
const password = ref("");
const remember = ref(false);
const showPassword = ref(false);

function submitLogin() {
  emit("submit", {
    email: email.value,
    password: password.value,
    remember: remember.value
  });
}
</script>

<template>
  <form class="login-form" @submit.prevent="submitLogin">
    <LoginInput
      v-model="email"
      label="Email"
      icon="✉"
      type="email"
      placeholder="you@email.com"
    />
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
    <div class="options">
      <label class="remember-me">
        <input v-model="remember" type="checkbox" />
        <span>Remember me</span>
      </label>
      <a href="#">Forgot password?</a>
    </div>
    <button class="primary-button" type="submit">Log In</button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #64748b;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remember-me input {
  cursor: pointer;
}

.options a {
  color: #156d59;
  text-decoration: none;
  font-weight: 700;
}

.options a:hover {
  text-decoration: underline;
}

.primary-button {
  width: 100%;
  border: 0;
  border-radius: 12px;
  padding: 13px 20px;
  background: #1b7a5e;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.primary-button:hover {
  background: #145944;
}
</style>
