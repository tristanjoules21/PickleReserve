<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import LoginForm from "../../components/auth/LoginForm.vue";
import LoginVisual from "../../components/auth/LoginVisual.vue";
import api from "../../services/api";
import { clearAuth, getApiErrorMessage, saveAuth } from "../../services/auth";

const router = useRouter();
const loading = ref(false);
const errorMessage = ref("");

async function submitLogin(credentials) {
  loading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await api.post("/login", credentials);
    if (String(data.user?.role).toUpperCase() !== "ADMIN") {
      clearAuth();
      errorMessage.value = "Only administrator accounts can sign in here.";
      return;
    }

    saveAuth(data, credentials.remember);
    await router.push("/admin");
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, "Unable to log in. Please try again.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <LoginVisual />
    <main class="login-panel">
      <div class="login-card">
        <p class="eyebrow"><span aria-hidden="true"></span> Player portal</p>
        <h1>Welcome back<span class="heading-period">.</span></h1>
        <p class="subtext">Sign in to pick up where you left off.</p>
        <LoginForm :loading="loading" @submit="submitLogin" />
        <p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p>
        <p class="security-note">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2.5 16 5v4.7c0 3.8-2.6 6.4-6 7.8-3.4-1.4-6-4-6-7.8V5l6-2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            <path d="m7.5 9.8 1.7 1.7 3.4-3.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Your account is protected and secure.
        </p>
        <p class="register-copy">
          Administrator access only. Contact your system administrator for an account.
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  background: #0f172a;
}

.login-panel {
  --auth-input-bg: #18243a;
  --auth-input-border: rgba(226, 232, 240, 0.12);
  --auth-input-focus-border: #a3e635;
  --auth-input-focus-ring: rgba(163, 230, 53, 0.14);
  --auth-input-label: #d3dbe7;
  --auth-input-icon: #a3b0c2;
  --auth-input-text: #f8fafc;
  --auth-input-placeholder: #8795a9;
  --auth-input-toggle: #a3e635;
  --auth-accent: #a3e635;
  --auth-accent-hover: #bef264;
  --auth-button-text: #0f172a;
  width: 50%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(32px, 6vw, 88px);
  background:
    radial-gradient(ellipse at 85% 12%, rgba(132, 204, 22, 0.09), transparent 34rem),
    radial-gradient(ellipse at 0% 78%, rgba(56, 91, 141, 0.1), transparent 34rem),
    #0f172a;
}

.login-card {
  width: min(100%, 440px);
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px;
  color: #a3b0c2;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.eyebrow span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a3e635;
  box-shadow: 0 0 0 4px rgba(163, 230, 53, 0.14);
}

.login-card h1 {
  margin: 0 0 10px;
  color: #f8fafc;
  font-size: clamp(2.35rem, 4vw, 3.25rem);
  font-weight: 750;
  letter-spacing: -0.055em;
  line-height: 1.08;
}

.heading-period {
  color: #a3e635;
}

.subtext {
  margin: 0 0 34px;
  color: #a3b0c2;
  font-size: 0.98rem;
  line-height: 1.6;
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 24px 0 0;
  color: #a3b0c2;
  font-size: 0.78rem;
}

.security-note svg {
  width: 17px;
  height: 17px;
  color: #a3e635;
  flex: 0 0 auto;
}

.register-copy {
  margin: 34px 0 0;
  text-align: center;
  color: #a3b0c2;
  font-size: 0.9rem;
}

.register-copy a {
  margin-left: 4px;
  color: #a3e635;
  font-weight: 750;
  text-decoration: none;
}

.register-copy a:hover,
.register-copy a:focus-visible {
  color: #bef264;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.auth-error {
  margin: 18px 0 0;
  padding: 11px 14px;
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 10px;
  background: rgba(127, 29, 29, 0.22);
  color: #fecaca;
  font-size: 0.88rem;
}

@media (max-width: 800px) {
  .auth-page {
    flex-direction: column;
  }

  .login-panel {
    width: 100%;
    min-height: auto;
    flex: 1;
    padding: 48px 24px 56px;
  }

  .login-card {
    max-width: 460px;
  }
}

@media (max-width: 480px) {
  .login-panel {
    padding: 40px 22px 48px;
  }

  .subtext {
    margin-bottom: 28px;
  }
}
</style>
