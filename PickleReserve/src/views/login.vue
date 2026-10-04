<template>
  <div class="login-page">

    <!-- Left Side -->
    <section class="login-visual">
      <div class="visual-content">
        <h2>Your next game starts here.</h2>

        <p>
          Join a community of players booking courts the smarter way.
          Fast, secure, and always available.
        </p>
      </div>
    </section>

    <!-- Right Side -->
    <main class="login-panel">
      <div class="login-card">

        <router-link to="/" class="back-link">
          ← Back to home
        </router-link>

        <h1>Welcome back</h1>

        <p class="subtext">
          Log in to manage your reservations.
        </p>

        <form class="login-form" @submit.prevent="submitLogin">

          <!-- Email -->
          <label>
            <span>Email</span>

            <div class="field-wrap">
              <span class="icon">✉</span>

              <input
                v-model="email"
                type="email"
                placeholder="you@email.com"
                required
              />
            </div>
          </label>

          <!-- Password -->
          <label>
            <span>Password</span>

            <div class="field-wrap">
              <span class="icon">🔒</span>

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
              />

              <button
                class="password-toggle"
                type="button"
                @click="togglePassword"
              >
                {{ showPassword ? "🙈" : "👁" }}
              </button>
            </div>
          </label>

          <!-- Options -->
          <div class="options">

            <label class="remember-me">
              <input
                type="checkbox"
                v-model="remember"
              />

              <span>Remember me</span>
            </label>

            <a href="#">
              Forgot password?
            </a>

          </div>

          <!-- Login Button -->
          <button
            class="primary-button"
            type="submit"
          >
            Log In
          </button>

        </form>

        <!-- Register -->
        <p class="register-copy">
          Don't have an account?

          <router-link to="/register">
            Register
          </router-link>
        </p>

      </div>
    </main>

  </div>
</template>


<script setup>

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const showPassword = ref(false);
const email = ref("");
const password = ref("");
const remember = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function submitLogin() {
  alert("Login submitted");

  // For now, go to dashboard
  router.push("/dashboard");
}

</script>


<style scoped>

* {
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  display: flex;
  background: white;
}


/* LEFT SIDE */

.login-visual {
  width: 50%;

  background-image:
    linear-gradient(
      rgba(23, 141, 90, 0.58),
      rgba(5, 88, 64, 0.64)
    ),
    url("/login-background.webp");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  background-color: #035b48;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 60px;
}

.visual-content {
  max-width: 500px;
}

.visual-content h2 {
  margin: 0 0 20px;

  font-size: clamp(2rem, 3.8vw, 3rem);

  line-height: 1.05;
}

.visual-content p {
  max-width: 420px;

  font-size: 1.18rem;

  line-height: 1.7;

  color: rgba(255, 255, 255, 0.85);
}


/* RIGHT SIDE */

.login-panel {
  width: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px;

  background: white;
}

.login-card {
  width: min(100%, 440px);
}


/* BACK BUTTON */

.back-link {
  display: inline-flex;

  align-items: center;

  margin-bottom: 50px;

  color: #64748b;

  text-decoration: none;

  font-size: 0.88rem;
}

.back-link:hover {
  color: #156d59;
}


/* TITLE */

.login-card h1 {
  margin: 0 0 12px;

  font-size: 2rem;

  color: #1f2937;
}

.subtext {
  margin: 0 0 30px;

  font-size: 0.88rem;

  color: #64748b;
}


/* FORM */

.login-form {
  display: flex;

  flex-direction: column;

  gap: 22px;
}

.login-form > label {
  display: flex;

  flex-direction: column;

  gap: 8px;

  font-size: 0.88rem;

  font-weight: 700;

  color: #475569;
}


/* INPUT */

.field-wrap {
  position: relative;

  display: flex;

  align-items: center;

  border: 1px solid #cbd5e1;

  background: white;

  border-radius: 12px;

  min-height: 48px;
}

.field-wrap:focus-within {
  border-color: #1b7a5e;
}

.field-wrap .icon {
  position: absolute;

  left: 14px;

  color: #94a3b8;
}

.field-wrap input {
  width: 100%;

  border: 0;

  outline: none;

  padding: 12px 42px;

  border-radius: 12px;

  font: inherit;

  color: #334155;
}


/* PASSWORD BUTTON */

.password-toggle {
  position: absolute;

  right: 12px;

  border: 0;

  background: transparent;

  cursor: pointer;

  color: #64748b;
}


/* OPTIONS */

.options {
  display: flex;

  align-items: center;

  justify-content: space-between;

  font-size: 0.82rem;

  color: #64748b;
}

.remember-me {
  display: flex !important;

  flex-direction: row !important;

  align-items: center;

  gap: 8px;

  font-weight: normal !important;
}

.remember-me input {
  cursor: pointer;
}

.options a,
.register-copy a {
  color: #156d59;

  text-decoration: none;

  font-weight: 700;
}

.options a:hover,
.register-copy a:hover {
  text-decoration: underline;
}


/* LOGIN BUTTON */

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


/* REGISTER */

.register-copy {
  margin: 24px 0 0;

  text-align: center;

  font-size: 0.84rem;

  color: #64748b;
}


/* MOBILE */

@media (max-width: 800px) {

  .login-page {
    flex-direction: column;
  }

  .login-visual,
  .login-panel {
    width: 100%;
  }

  .login-visual {
    min-height: 260px;
  }

}

</style>