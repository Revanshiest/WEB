import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
const wasOffline = ref(false)

export function useNetworkStatus() {
  function handleOnline() {
    isOnline.value = true
    wasOffline.value = true
  }

  function handleOffline() {
    isOnline.value = false
  }

  function resetRestoredState() {
    wasOffline.value = false
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return {
    isOnline,
    wasOffline,
    resetRestoredState
  }
}

