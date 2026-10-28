<script setup>
import { useRouter } from "vue-router";
import LoginVisual from "../../components/auth/LoginVisual.vue";
import RegisterForm from "../../components/auth/RegisterForm.vue";

const router = useRouter();

function submitRegister() {
  alert("Account created!");
  router.push("/login");
}
</script>

<template>
  <div class="auth-page">
    <LoginVisual />
    <main class="login-panel">
      <div class="login-card">
        <router-link to="/" class="back-link">← Back to home</router-link>
        <h1>Create your account</h1>
        <p class="subtext">Start booking courts in minutes.</p>
        <RegisterForm @submit="submitRegister" />
        <p class="register-copy">
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>
        <p class="admin-copy">
          Admin?
          <router-link to="/admin">Go to admin panel</router-link>
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
  background: #f8fafc;
}

.login-card {
  width: min(100%, 486px);
}

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

.register-copy,
.admin-copy {
  text-align: center;
  color: #64748b;
}

.register-copy {
  margin: 28px 0 0;
  font-size: 0.9rem;
}

.admin-copy {
  margin-top: 20px;
  font-size: 0.85rem;
  color: #94a3b8;
}

.register-copy a {
  color: #16a34a;
  font-weight: 700;
}

.admin-copy a {
  color: #475569;
  text-decoration: none;
}

.register-copy a:hover,
.admin-copy a:hover {
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
