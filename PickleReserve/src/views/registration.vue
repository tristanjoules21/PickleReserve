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

        <!-- Back -->
        <router-link to="/" class="back-link">
          ← Back to home
        </router-link>

        <!-- Title -->
        <h1>Create your account</h1>

        <p class="subtext">
          Start booking courts in minutes.
        </p>


        <!-- Registration Form -->
        <form
          class="login-form"
          @submit.prevent="submitRegister"
        >

          <!-- Full Name -->
          <label>
            <span>Full name</span>

            <div class="field-wrap">
              <span class="icon">♙</span>

              <input
                v-model="name"
                type="text"
                placeholder="Alex Morgan"
                required
              />
            </div>
          </label>


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


          <!-- Create Account -->
          <button
            class="primary-button"
            type="submit"
          >
            Create Account
          </button>

        </form>


        <!-- Login -->
        <p class="register-copy">
          Already have an account?

          <router-link to="/login">
            Log in
          </router-link>
        </p>


        <!-- Admin -->
        <p class="admin-copy">
          Admin?

          <router-link to="/admin">
            Go to admin panel
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

const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);


function togglePassword() {
  showPassword.value = !showPassword.value;
}


function submitRegister() {

  alert("Account created!");

  router.push("/login");

}

</script>


<style scoped>

* {
  box-sizing: border-box;
}


/* PAGE */

.login-page {
  min-height: 100vh;
  width: min(100%, 100%);

  display: flex;

  background: white;
}


/* LEFT SIDE */

.login-visual {
  flex: 1 1 50%;
  min-width: 0;

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

  padding: clamp(24px, 5vw, 60px);
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
  flex: 1 1 50%;
  min-width: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: clamp(24px, 4vw, 40px);

  background: #f8fafc;
}

.login-card {
  width: min(100%, 486px);
  max-width: 100%;
}


/* BACK */

.back-link {
  display: inline-flex;

  align-items: center;

  margin-bottom: 50px;

  color: #64748b;

  text-decoration: none;

  font-size: 0.95rem;
}

.back-link:hover {
  color: #156d59;
}


/* TITLE */

.login-card h1 {
  margin: 0 0 12px;

  font-size: 2rem;

  color: #0f172a;
}

.subtext {
  margin: 0 0 30px;

  font-size: 0.95rem;

  color: #64748b;
}


/* FORM */

.login-form {
  display: flex;

  flex-direction: column;

  gap: 20px;
}

.login-form > label {
  display: flex;

  flex-direction: column;

  gap: 8px;

  font-size: 0.95rem;

  font-weight: 600;

  color: #1e293b;
}


/* INPUT */

.field-wrap {
  position: relative;

  display: flex;

  align-items: center;

  border: 1px solid #dbe1e8;

  background: white;

  border-radius: 12px;

  min-height: 54px;
}

.field-wrap:focus-within {
  border-color: #16a34a;
}

.field-wrap .icon {
  position: absolute;

  left: 16px;

  color: #94a3b8;
}

.field-wrap input {
  width: 100%;

  border: 0;

  outline: none;

  padding: 14px 45px;

  border-radius: 12px;

  font-size: 0.95rem;

  color: #334155;
}

.field-wrap input::placeholder {
  color: #94a3b8;
}


/* PASSWORD */

.password-toggle {
  position: absolute;

  right: 14px;

  border: 0;

  background: transparent;

  cursor: pointer;

  color: #94a3b8;
}


/* BUTTON */

.primary-button {
  width: 100%;

  border: 0;

  border-radius: 12px;

  padding: 14px 20px;

  background: #16a34a;

  color: white;

  font-size: 1rem;

  font-weight: 700;

  cursor: pointer;

  margin-top: 2px;

  box-shadow: 0 10px 25px rgba(22, 163, 74, 0.18);
}

.primary-button:hover {
  background: #15803d;
}


/* LOGIN LINK */

.register-copy {
  margin: 28px 0 0;

  text-align: center;

  font-size: 0.9rem;

  color: #64748b;
}

.register-copy a {
  color: #16a34a;

  text-decoration: none;

  font-weight: 700;
}

.register-copy a:hover {
  text-decoration: underline;
}


/* ADMIN */

.admin-copy {
  margin-top: 20px;

  text-align: center;

  font-size: 0.85rem;

  color: #94a3b8;
}

.admin-copy a {
  color: #475569;

  text-decoration: none;
}

.admin-copy a:hover {
  color: #16a34a;
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