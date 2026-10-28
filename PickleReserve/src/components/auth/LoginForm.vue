<script setup>
import { ref } from "vue";
import LoginInput from "./LoginInput.vue";

defineProps({
  loading: { type: Boolean, default: false }
});

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
      icon="mail"
      type="email"
      autocomplete="email"
      placeholder="you@email.com"
    />
    <LoginInput
      v-model="password"
      label="Password"
      icon="lock"
      type="password"
      autocomplete="current-password"
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
    <button class="primary-button" type="submit" :disabled="loading">
      {{ loading ? "Signing in..." : "Log In" }}
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--auth-input-label, #748078);
  font-size: 0.84rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}

.remember-me input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--auth-accent, #347b53);
  cursor: pointer;
}

.options a {
  color: var(--auth-accent, #347b53);
  text-decoration: none;
  font-weight: 700;
}

.options a:hover,
.options a:focus-visible {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.primary-button {
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 15px 20px;
  background: linear-gradient(110deg, var(--auth-accent, #347b53), #286946);
  color: var(--auth-button-text, white);
  font: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(40, 105, 70, 0.18);
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.primary-button:hover {
  background: linear-gradient(110deg, var(--auth-accent-hover, #2c704a), #205d3d);
  box-shadow: 0 12px 26px rgba(40, 105, 70, 0.24);
  transform: translateY(-1px);
}

.primary-button:disabled {
  cursor: wait;
  opacity: 0.72;
  transform: none;
}

.primary-button:focus-visible {
  outline: 3px solid var(--auth-input-focus-ring, rgba(52, 123, 83, 0.32));
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .primary-button {
    transition: none;
  }
}
</style>
