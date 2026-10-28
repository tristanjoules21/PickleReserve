<script setup>
import { useId } from "vue";

defineProps({
  label: { type: String, required: true },
  icon: { type: String, required: true },
  modelValue: { type: String, default: "" },
  type: { type: String, default: "text" },
  autocomplete: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  toggleable: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue", "toggle"]);
const inputId = useId();
</script>

<template>
  <div class="login-input">
    <label :for="inputId">{{ label }}</label>
    <div class="field-wrap" :class="{ 'has-toggle': toggleable }">
      <span class="icon" aria-hidden="true">
        <svg v-if="icon === 'mail'" viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" stroke-width="1.7" />
          <path d="m5 7 7 5.5L19 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="icon === 'lock'" viewBox="0 0 24 24" fill="none">
          <rect x="4.5" y="10" width="15" height="11" rx="3" stroke="currentColor" stroke-width="1.7" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
        <svg v-else-if="icon === 'user'" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.7" />
          <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
        <span v-else>{{ icon }}</span>
      </span>
      <input
        :id="inputId"
        :value="modelValue"
        :type="toggleable && showPassword ? 'text' : type"
        :autocomplete="autocomplete || undefined"
        :placeholder="placeholder"
        required
        @input="emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="toggleable"
        class="password-toggle"
        type="button"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :aria-pressed="showPassword"
        @click="emit('toggle')"
      >
        {{ showPassword ? "Hide" : "Show" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-input {
  display: flex;
  flex-direction: column;
  gap: 9px;
  color: var(--auth-input-label, #3d5045);
  font-size: 0.87rem;
  font-weight: 700;
}

.login-input > label {
  cursor: pointer;
}

.field-wrap {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 56px;
  border: 1px solid var(--auth-input-border, #d6dfd8);
  background: var(--auth-input-bg, white);
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(34, 57, 43, 0.025);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.field-wrap:focus-within {
  border-color: var(--auth-input-focus-border, #4a9364);
  box-shadow: 0 0 0 4px var(--auth-input-focus-ring, rgba(74, 147, 100, 0.12));
}

.field-wrap .icon {
  position: absolute;
  left: 15px;
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  color: var(--auth-input-icon, #7d9785);
}

.field-wrap .icon svg {
  display: block;
  width: 19px;
  height: 19px;
}

.field-wrap input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  padding: 14px 16px 14px 48px;
  border-radius: inherit;
  background: transparent;
  font: inherit;
  font-size: 0.94rem;
  color: var(--auth-input-text, #26382e);
}

.field-wrap input::placeholder {
  color: var(--auth-input-placeholder, #a5b0a9);
}

.field-wrap.has-toggle input {
  padding-right: 74px;
}

.field-wrap input:focus-visible {
  outline: none;
}

.password-toggle {
  position: absolute;
  right: 14px;
  border: 0;
  background: transparent;
  padding: 6px;
  color: var(--auth-input-toggle, #4a7e5d);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 750;
  cursor: pointer;
}

.password-toggle:hover {
  color: var(--auth-input-focus-border, #275d3d);
}

.password-toggle:focus-visible {
  border-radius: 6px;
  outline: 2px solid var(--auth-input-focus-border, rgba(52, 123, 83, 0.5));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .field-wrap {
    transition: none;
  }
}
</style>
