const KEY = 'belong_anon_id'

function generate() {
  return 'anon-' + Math.random().toString(36).slice(2, 11) + '-' + Date.now().toString(36)
}

export function getAnonId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = generate()
    localStorage.setItem(KEY, id)
  }
  return id
}
