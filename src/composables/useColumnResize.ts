import { ref } from 'vue'

export interface ColumnWidths {
  [key: string]: number
}

export function useColumnResize(initial: ColumnWidths) {
  const widths = ref<ColumnWidths>({ ...initial })

  function startResize(col: string, e: MouseEvent): void {
    e.preventDefault()
    const startX = e.clientX
    const startW = widths.value[col] ?? 120

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX
      widths.value[col] = Math.max(60, startW + delta)
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return { widths, startResize }
}
