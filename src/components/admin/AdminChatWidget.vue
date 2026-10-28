<script setup>
import { nextTick, ref } from 'vue'
import { MessageCircle, Send, X } from 'lucide-vue-next'

const STORAGE_KEY = 'picklereserve.admin-chat-preview'

function readMessages() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

const isOpen = ref(false)
const draft = ref('')
const messages = ref(readMessages())
const messageList = ref(null)

async function sendMessage() {
  const text = draft.value.trim()
  if (!text) return

  messages.value.push({
    id: `${Date.now()}-${messages.value.length}`,
    text,
    time: new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date())
  })

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  } catch {
    // Keep the current conversation usable when browser storage is unavailable.
  }

  draft.value = ''
  await nextTick()
  messageList.value?.scrollTo({
    top: messageList.value.scrollHeight,
    behavior: 'smooth'
  })
}
</script>

<template>
  <section class="chat-widget" aria-label="Admin customer chat">
    <Transition name="chat-panel">
      <div v-if="isOpen" class="chat-panel" role="dialog" aria-labelledby="chat-title">
        <header class="chat-header">
          <div class="header-copy">
            <span class="header-icon"><MessageCircle :size="17" /></span>
            <div>
              <h2 id="chat-title">Customer messages</h2>
              <span class="preview-label">Local preview</span>
            </div>
          </div>
          <button class="icon-button close-button" type="button" aria-label="Close chat" @click="isOpen = false">
            <X :size="18" />
          </button>
        </header>

        <div ref="messageList" class="message-list" aria-live="polite">
          <div v-if="!messages.length" class="empty-state">
            <span class="empty-icon"><MessageCircle :size="22" /></span>
            <strong>No messages yet</strong>
            <span>Messages you send in this preview will appear here.</span>
          </div>

          <div v-for="message in messages" :key="message.id" class="message-row">
            <div class="message-bubble">
              <p>{{ message.text }}</p>
              <time>{{ message.time }}</time>
            </div>
          </div>
        </div>

        <form class="composer" @submit.prevent="sendMessage">
          <label class="sr-only" for="admin-chat-message">Write a message</label>
          <input
            id="admin-chat-message"
            v-model="draft"
            type="text"
            maxlength="500"
            placeholder="Write a message..."
            autocomplete="off"
          />
          <button class="send-button" type="submit" aria-label="Send message" :disabled="!draft.trim()">
            <Send :size="16" />
          </button>
        </form>
      </div>
    </Transition>

    <button
      class="launcher"
      type="button"
      :aria-expanded="isOpen"
      aria-label="Open customer messages"
      @click="isOpen = !isOpen"
    >
      <X v-if="isOpen" :size="19" />
      <MessageCircle v-else :size="19" />
      <span>{{ isOpen ? 'Close' : 'Messages' }}</span>
    </button>
  </section>
</template>

<style scoped>
.chat-widget { position: fixed; z-index: 80; right: 24px; bottom: 22px; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; color: #1e2c25; font-family: Inter, 'Segoe UI', sans-serif; }
.chat-panel { width: min(360px, calc(100vw - 32px)); height: min(440px, calc(100vh - 110px)); min-height: 300px; overflow: hidden; border: 1px solid #dce6e0; border-radius: 9px; background: #fff; box-shadow: 0 14px 42px rgb(20 43 31 / 20%); display: flex; flex-direction: column; }
.chat-header { min-height: 66px; padding: 0 15px; border-bottom: 1px solid #e8eeea; display: flex; align-items: center; justify-content: space-between; }
.header-copy { display: flex; align-items: center; gap: 10px; }
.header-icon { width: 34px; height: 34px; border-radius: 7px; display: grid; place-items: center; background: #e9f5ee; color: #087c52; }
.chat-header h2 { margin: 0; font-size: 14px; font-weight: 700; }
.preview-label { display: block; margin-top: 4px; color: #748078; font-size: 10px; }
.icon-button, .send-button { border: 0; cursor: pointer; display: grid; place-items: center; }
.close-button { width: 34px; height: 34px; border-radius: 6px; background: transparent; color: #637169; }
.close-button:hover { background: #f1f5f2; }
.message-list { flex: 1; min-height: 0; overflow-y: auto; padding: 16px; background: #f8faf8; }
.empty-state { height: 100%; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; text-align: center; }
.empty-icon { width: 42px; height: 42px; margin-bottom: 3px; border-radius: 50%; display: grid; place-items: center; background: #e9f5ee; color: #087c52; }
.empty-state strong { font-size: 13px; }
.empty-state > span:last-child { max-width: 220px; color: #7a867f; font-size: 11px; line-height: 1.5; }
.message-row { display: flex; justify-content: flex-end; margin: 7px 0; }
.message-bubble { max-width: 85%; padding: 10px 12px 7px; border-radius: 8px 8px 2px 8px; background: #087c52; color: #fff; }
.message-bubble p { margin: 0; overflow-wrap: anywhere; font-size: 12px; line-height: 1.5; }
.message-bubble time { display: block; margin-top: 5px; color: rgb(255 255 255 / 75%); font-size: 9px; text-align: right; }
.composer { min-height: 62px; padding: 10px; border-top: 1px solid #e8eeea; display: flex; align-items: center; gap: 8px; }
.composer input { width: 0; height: 40px; flex: 1; padding: 0 11px; border: 1px solid #dce5df; border-radius: 6px; outline: none; color: #223129; font: inherit; font-size: 12px; }
.composer input:focus { border-color: #16895e; box-shadow: 0 0 0 3px rgb(22 137 94 / 12%); }
.send-button { width: 40px; height: 40px; border-radius: 6px; background: #087c52; color: #fff; }
.send-button:disabled { cursor: not-allowed; opacity: .45; }
.launcher { min-width: 116px; height: 46px; padding: 0 14px; border: 0; border-radius: 7px; display: flex; align-items: center; justify-content: center; gap: 9px; background: #087c52; color: #fff; box-shadow: 0 5px 16px rgb(10 76 50 / 25%); font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
.launcher:hover { background: #066a46; }
.chat-panel-enter-active, .chat-panel-leave-active { transition: opacity .16s ease, transform .16s ease; }
.chat-panel-enter-from, .chat-panel-leave-to { opacity: 0; transform: translateY(8px); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 480px) { .chat-widget { right: 12px; bottom: 12px; } .chat-panel { height: min(440px, calc(100dvh - 90px)); } }
@media (prefers-reduced-motion: reduce) { .chat-panel-enter-active, .chat-panel-leave-active { transition: none; } }
</style>