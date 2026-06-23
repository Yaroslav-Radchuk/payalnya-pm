export function formatDate(iso: string): string {
  const d = iso.includes('T') ? iso : iso + 'T00:00:00'
  return new Date(d).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateShort(iso: string): string {
  const d = iso.includes('T') ? iso : iso + 'T00:00:00'
  return new Date(d).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
  })
}
