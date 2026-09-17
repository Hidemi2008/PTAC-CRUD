export default async function excluirUsuario(id) {
  const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'DELETE',
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  // em jsonplaceholder, responde 200 com corpo vazio ({})
  return true
}