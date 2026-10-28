<template>
  <div class="auth-page">
    <LoginVisual />
    <main class="login-panel">
      <section class="notice-card">
        <p class="eyebrow"><span aria-hidden="true"></span> Admin accounts</p>
        <h1>Registration is disabled<span>.</span></h1>
        <p>
          Administrator accounts are created securely by the system administrator.
          Contact them if you need access to the dashboard.
        </p>
        <router-link class="back-link" to="/login">Return to admin login</router-link>
      </section>
    </main>
  </div>
</template>

<script setup>
import LoginVisual from "../../components/auth/LoginVisual.vue";
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
  min-height: 100svh;
  background: #0f172a;
}

.login-panel {
  display: flex;
  width: 50%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: clamp(32px, 6vw, 88px);
  background:
    radial-gradient(ellipse at 85% 12%, rgba(132, 204, 22, 0.09), transparent 34rem),
    radial-gradient(ellipse at 0% 78%, rgba(56, 91, 141, 0.1), transparent 34rem),
    #0f172a;
}

.notice-card {
  width: min(100%, 460px);
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
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

h1 {
  margin: 0 0 14px;
  color: #f8fafc;
  font-size: clamp(2.1rem, 3.5vw, 2.8rem);
  font-weight: 750;
  letter-spacing: -0.055em;
  line-height: 1.08;
}

h1 span {
  color: #a3e635;
}

.notice-card > p:not(.eyebrow) {
  margin: 0;
  color: #a3b0c2;
  font-size: 0.98rem;
  line-height: 1.7;
}

.back-link {
  display: inline-flex;
  margin-top: 30px;
  color: #a3e635;
  font-weight: 700;
  text-decoration: none;
}

.back-link:hover,
.back-link:focus-visible {
  color: #bef264;
  text-decoration: underline;
  text-underline-offset: 3px;
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
}
</style>
