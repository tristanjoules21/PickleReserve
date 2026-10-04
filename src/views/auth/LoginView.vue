<script setup>
import { useRouter } from "vue-router";
import LoginForm from "../../components/auth/LoginForm.vue";
import LoginVisual from "../../components/auth/LoginVisual.vue";

const router = useRouter();

function submitLogin() {
  alert("Login submitted");
  router.push("/dashboard");
}
</script>

<template>
  <div class="auth-page">
    <LoginVisual />
    <main class="login-panel">
      <div class="login-card">

        <h1>Welcome back</h1>
        <p class="subtext">Log in to manage your reservations.</p>
        <LoginForm @submit="submitLogin" />
        <p class="register-copy">
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  background: white;
}

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

.register-copy {
  margin: 24px 0 0;
  text-align: center;
  font-size: 0.84rem;
  color: #64748b;
}

.register-copy a {
  color: #156d59;
  text-decoration: none;
  font-weight: 700;
}

.register-copy a:hover {
  text-decoration: underline;
}

@media (max-width: 800px) {
  .auth-page {
    flex-direction: column;
  }

  .login-panel {
    width: 100%;
  }
}
</style>
