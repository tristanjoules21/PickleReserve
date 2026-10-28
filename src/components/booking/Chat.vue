<script setup>
import { ref } from 'vue'

const messages = ref([
  {
    from: 'venue',
    text: 'Hello! How can we assist you with your reservation?',
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
  },
]) 

const draft = ref('')

function sendMessage() {
  if (!draft.value.trim()) return

  messages.value.push({
    from: 'me',
    text: draft.value.trim(),
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
  })

  draft.value = ''
}
</script>

<template>
  <section class="other-tab chat">
    <div
      v-for="(message, index) in messages"
      :key="index"
      :class="['message', message.from]"
    >
      <div class="bubble">
        {{ message.text }}
        <small>{{ message.time }}</small>
      </div>
    </div>

    <div class="chat-input">
      <input v-model="draft" placeholder="Message the venue..." @keyup.enter="sendMessage" />
      <button type="button" @click="sendMessage">Send</button>
    </div>
  </section>
</template>

<style scoped>
.other-tab {
  background: white;
  padding: 18px 16px 60px;
  border-radius: 0 0 22px 22px;
}

.chat {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
}

.message.venue {
  justify-content: flex-start;
}

.message.me {
  justify-content: flex-end;
}

.bubble {
  max-width: 78%;
  padding: 11px 12px;
  border-radius: 14px;
  font-size: 12px;
  line-height: 1.5;
}

.message.venue .bubble {
  background: #f4f7f6;
  border: 1px solid #edf0ef;
  color: #33413e;
}

.message.me .bubble {
  background: #17875f;
  color: white;
}

.bubble small {
  display: block;
  margin-top: 5px;
  font-size: 10px;
  opacity: 0.8;
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  border-top: 1px solid #edf0ef;
  padding-top: 14px;
}

.chat-input input {
  flex: 1;
  height: 42px;
  border: 1px solid #e3e9e7;
  border-radius: 12px;
  background: #f9fbfa;
  padding: 0 12px;
  font-size: 13px;
  color: #141c1a;
}

.chat-input button {
  border: none;
  border-radius: 12px;
  background: #17875f;
  color: white;
  height: 42px;
  padding: 0 14px;
  font-weight: 700;
}
</style>
