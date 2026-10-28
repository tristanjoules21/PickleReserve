<script setup>
import PickleReserveLogo from '@/components/ui/PickleReserveLogo.vue'
</script>

<template>
  <section class="login-visual">
    <div class="visual-shade" aria-hidden="true"></div>
    <div class="visual-content">
      <PickleReserveLogo class="login-brand" />
      <div class="visual-copy">
        <p class="visual-eyebrow">YOUR COURT. YOUR TIME.</p>
        <h2>Make room for <span>one more game.</span></h2>
        <p>Find your next match, reserve a court, and get straight to the good part.</p>
      </div>
      <p class="visual-footer"><span aria-hidden="true"></span> A better way to get on court.</p>
    </div>
  </section>
</template>

<style scoped>
.login-visual {
  position: relative;
  width: 50%;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background-image:
    linear-gradient(135deg, rgba(10, 39, 29, 0.54), rgba(6, 65, 45, 0.68)),
    url("/login-background.webp");
  background-size: cover;
  background-position: 54% center;
  background-repeat: no-repeat;
  background-color: #154e39;
  color: white;
  display: flex;
  align-items: stretch;
  padding: clamp(32px, 5vw, 72px);
}

.visual-shade {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 10% 85%, rgba(12, 31, 23, 0.48), transparent 55%),
    linear-gradient(180deg, rgba(9, 29, 22, 0.15), transparent 35%, rgba(7, 29, 20, 0.2));
  pointer-events: none;
}

.visual-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(100%, 560px);
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0 auto;
}

.login-brand {
  margin: 0;
}

.visual-copy {
  max-width: 520px;
  padding: 72px 0;
}

.visual-eyebrow {
  margin: 0 0 22px;
  color: #c5e8a4;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.visual-content h2 {
  margin: 0 0 20px;
  font-size: clamp(2.5rem, 5vw, 4.65rem);
  font-weight: 750;
  letter-spacing: -0.06em;
  line-height: 0.99;
  text-wrap: balance;
}

.visual-content h2 span {
  color: #c5e8a4;
}

.visual-content .visual-copy > p:last-child {
  max-width: 390px;
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(1rem, 1.4vw, 1.12rem);
  line-height: 1.75;
}

.visual-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.visual-footer span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c5e8a4;
  box-shadow: 0 0 0 4px rgba(197, 232, 164, 0.18);
}

@media (max-width: 800px) {
  .login-visual {
    width: 100%;
    min-height: 290px;
    flex: 0 0 auto;
    padding: 28px 30px;
  }

  .visual-copy {
    padding: 40px 0 34px;
  }

  .visual-content h2 {
    max-width: 480px;
    font-size: clamp(2.3rem, 7vw, 3.2rem);
  }

  .visual-footer {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-visual {
    min-height: 270px;
    padding: 24px;
  }

  .visual-copy {
    padding: 32px 0 0;
  }

  .visual-eyebrow {
    margin-bottom: 14px;
    font-size: 0.68rem;
  }

  .visual-content h2 {
    margin-bottom: 12px;
    font-size: 2.45rem;
  }

  .visual-content .visual-copy > p:last-child {
    font-size: 0.92rem;
  }
}
</style>
