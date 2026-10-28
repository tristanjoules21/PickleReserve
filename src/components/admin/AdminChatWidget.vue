<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { MessageCircle, Send, X } from 'lucide-vue-next'
import {
  ADMIN_MESSAGES_CLEARED_EVENT,
  ADMIN_MESSAGES_STORAGE_KEY
} from '@/services/adminPreferences'

function readMessages() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(ADMIN_MESSAGES_STORAGE_KEY) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

const isOpen = ref(false)
const draft = ref('')
const messages = ref(readMessages())
const messageList = ref(null)

function handleMessagesCleared() {
  messages.value = []
}

onMounted(() => window.addEventListener(ADMIN_MESSAGES_CLEARED_EVENT, handleMessagesCleared))
onBeforeUnmount(() => window.removeEventListener(ADMIN_MESSAGES_CLEARED_EVENT, handleMessagesCleared))

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
    sessionStorage.setItem(ADMIN_MESSAGES_STORAGE_KEY, JSON.stringify(messages.value))
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
              <span class="preview-label"><span class="preview-dot"></span> Local preview</span>
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
            <span>Start a local preview conversation. This inbox is not connected to customers.</span>
          </div>

          <div v-for="message in messages" :key="message.id" class="message-row">
            <div class="message-bubble">
              <p>{{ message.text }}</p>
              <time>{{ message.time }}</time>
            </div>

            <p class="local-notice">Preview messages are saved only for this browser session.</p>
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
.chat-widget { position: fixed; z-index: 80; right: 26px; bottom: 24px; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; color: #f8fafc; font-family: Inter, 'Segoe UI', sans-serif; }
.chat-panel { width: min(376px, calc(100vw - 32px)); height: min(490px, calc(100vh - 112px)); min-height: 320px; overflow: hidden; border: 1px solid rgba(226, 232, 240, .13); border-radius: 18px; background: #111c30; box-shadow: 0 24px 70px rgba(0, 0, 0, .48), 0 0 0 1px rgba(163, 230, 53, .035); display: flex; flex-direction: column; }
.chat-header { min-height: 78px; padding: 0 18px; border-bottom: 1px solid rgba(226, 232, 240, .09); background: linear-gradient(110deg, rgba(163, 230, 53, .055), transparent 55%); display: flex; align-items: center; justify-content: space-between; }
.header-copy { display: flex; align-items: center; gap: 12px; }
.header-icon { width: 40px; height: 40px; border: 1px solid rgba(163, 230, 53, .18); border-radius: 12px; display: grid; place-items: center; background: rgba(163, 230, 53, .08); color: #a3e635; }
.chat-header h2 { margin: 0; color: #f8fafc; font-size: 14px; font-weight: 750; letter-spacing: -.01em; }
.preview-label { display: flex; align-items: center; gap: 6px; margin-top: 5px; color: #a3b0c2; font-size: 10px; }
.preview-dot { width: 6px; height: 6px; border-radius: 50%; background: #a3e635; box-shadow: 0 0 10px rgba(163, 230, 53, .6); }
.icon-button, .send-button { border: 0; cursor: pointer; display: grid; place-items: center; }
.close-button { width: 35px; height: 35px; border: 1px solid transparent; border-radius: 10px; background: transparent; color: #a3b0c2; transition: background .16s ease, color .16s ease; }
.close-button:hover { background: rgba(255, 255, 255, .07); color: #f8fafc; }
.message-list { flex: 1; min-height: 0; overflow-y: auto; padding: 18px 16px 10px; background: radial-gradient(ellipse at 50% 35%, rgba(56, 91, 141, .08), transparent 65%), #0f172a; }
.empty-state { min-height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; text-align: center; }
.empty-icon { width: 48px; height: 48px; margin-bottom: 4px; border: 1px solid rgba(163, 230, 53, .16); border-radius: 16px; display: grid; place-items: center; background: rgba(163, 230, 53, .07); color: #a3e635; }
.empty-state strong { color: #eaf0f8; font-size: 13px; font-weight: 700; }
.empty-state > span:last-child { max-width: 240px; color: #91a0b5; font-size: 11px; line-height: 1.6; }
.local-notice { margin: 12px 0 0; padding: 10px 11px; border: 1px solid rgba(226, 232, 240, .075); border-radius: 9px; color: #8392a8; font-size: 10px; line-height: 1.5; text-align: center; }
.message-row { display: flex; justify-content: flex-end; margin: 8px 0; }
.message-bubble { max-width: 85%; padding: 11px 13px 8px; border: 1px solid rgba(190, 242, 100, .45); border-radius: 13px 13px 4px 13px; background: linear-gradient(145deg, #bef264, #a3e635); color: #16220f; box-shadow: 0 5px 18px rgba(163, 230, 53, .1); }
.message-bubble p { margin: 0; overflow-wrap: anywhere; font-size: 12px; line-height: 1.55; }
.message-bubble time { display: block; margin-top: 5px; color: rgba(22, 34, 15, .66); font-size: 9px; text-align: right; }
.composer { min-height: 74px; padding: 12px; border-top: 1px solid rgba(226, 232, 240, .09); background: #111c30; display: flex; align-items: center; gap: 9px; }
.composer input { width: 0; height: 44px; flex: 1; padding: 0 13px; border: 1px solid rgba(226, 232, 240, .13); border-radius: 11px; outline: none; background: #0f172a; color: #f8fafc; font: inherit; font-size: 12px; transition: border-color .16s ease, box-shadow .16s ease; }
.composer input::placeholder { color: #8290a4; }
.composer input:focus { border-color: rgba(163, 230, 53, .65); box-shadow: 0 0 0 3px rgba(163, 230, 53, .1); }
.send-button { width: 44px; height: 44px; border: 1px solid rgba(190, 242, 100, .35); border-radius: 11px; background: #a3e635; color: #17220e; transition: transform .16s ease, background .16s ease; }
.send-button:not(:disabled):hover { transform: translateY(-1px); background: #bef264; }
.send-button:disabled { cursor: not-allowed; opacity: .42; }
.launcher { min-width: 126px; height: 48px; padding: 0 16px; border: 1px solid rgba(190, 242, 100, .42); border-radius: 13px; display: flex; align-items: center; justify-content: center; gap: 9px; background: linear-gradient(145deg, #bef264, #a3e635); color: #17220e; box-shadow: 0 8px 24px rgba(0, 0, 0, .3), 0 4px 18px rgba(163, 230, 53, .17); font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; transition: transform .16s ease, box-shadow .16s ease; }
.launcher:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0, 0, 0, .36), 0 4px 20px rgba(163, 230, 53, .24); }
.chat-panel-enter-active, .chat-panel-leave-active { transition: opacity .18s ease, transform .18s ease; }
.chat-panel-enter-from, .chat-panel-leave-to { opacity: 0; transform: translateY(10px) scale(.98); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 480px) { .chat-widget { right: 12px; bottom: 12px; } .chat-panel { height: min(490px, calc(100dvh - 90px)); } }
@media (prefers-reduced-motion: reduce) { .chat-panel-enter-active, .chat-panel-leave-active, .close-button, .send-button, .launcher { transition: none; } }
</style>