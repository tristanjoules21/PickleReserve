<script setup>
defineProps({
  label: { type: String, required: true },
  icon: { type: String, required: true },
  modelValue: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  toggleable: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue", "toggle"]);
</script>

<template>
  <label class="login-input">
    <span>{{ label }}</span>
    <div class="field-wrap">
      <span class="icon">{{ icon }}</span>
      <input
        :value="modelValue"
        :type="toggleable && showPassword ? 'text' : type"
        :placeholder="placeholder"
        required
        @input="emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="toggleable"
        class="password-toggle"
        type="button"
        @click="emit('toggle')"
      >
        {{ showPassword ? "🙈" : "👁" }}
      </button>
    </div>
  </label>
</template>

<style scoped>
.login-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #475569;
}

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

.password-toggle {
  position: absolute;
  right: 12px;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #64748b;
}
</style>
