import { ref } from 'vue'

interface ConfirmOptions {
  title: string
  message: string
  danger?: boolean
}

interface ConfirmState extends ConfirmOptions {
  visible: boolean
  resolve: ((v: boolean) => void) | null
}

const state = ref<ConfirmState>({
  visible: false,
  title: '',
  message: '',
  danger: false,
  resolve: null,
})

export function useConfirmState() {
  return state
}

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.value = { ...options, visible: true, resolve }
    })
  }

  return { confirm }
}
