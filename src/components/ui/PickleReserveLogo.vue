<script setup>
import logoMark from '@/assets/logo.svg'
</script>

<template>
  <div class="pickle-reserve-logo" role="img" aria-label="Pickle Reserve">
    <img class="pickle-reserve-logo-mark" :src="logoMark" alt="" />
    <span class="pickle-reserve-logo-type">
      <span class="pickle-reserve-logo-name">PICKLE</span>
      <span class="pickle-reserve-logo-tagline">RESERVE</span>
    </span>
  </div>
</template>

<style scoped>
.pickle-reserve-logo {
  display: inline-flex;
  height: 36px;
  flex: 0 0 auto;
  align-items: center;
  gap: 12px;
  user-select: none;
}

.pickle-reserve-logo-mark {
  display: block;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
}

.pickle-reserve-logo-type {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.pickle-reserve-logo-name {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.18em;
  line-height: 1;
}

.pickle-reserve-logo-tagline {
  margin-top: 2px;
  color: #a3e635;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.35em;
  line-height: 1.2;
}
</style>
