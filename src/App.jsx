// src/App.jsx
import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from './api'

const listarUsuarios = () => apiGet('/users')
const criarUsuario = (dados) => apiPost('/users', dados)
const atualizarUsuario = (id, dados) => apiPut(`/users/${id}`, dados)
const excluirUsuario = (id) => apiDelete(`/users/${id}`)

export default function App() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        setUsuarios(await listarUsuarios())
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  function mensagemDeErro(e) {
    if (e instanceof ApiError) {
      if (e.status === 404) return 'Recurso não encontrado.'
      if (e.status >= 500) return 'Erro no servidor. Tente de novo em instantes.'
      return `Erro ${e.status}: ${e.statusText}`
    }
    return 'Falha de rede: ' + e.message // TypeError: Failed to fetch
  }

  function limparFormulario() {
    setNome('')
    setEmail('')
    setEditandoId(null)
  }

  function iniciarEdicao(u) {
    setEditandoId(u.id)
    setNome(u.name)
    setEmail(u.email)
  }

  async function salvar(e) {
    e.preventDefault()
    setErro(null)
    try {
      if (editandoId) {
        const atualizado = await atualizarUsuario(editandoId, { name: nome, email })
        setUsuarios((lista) =>
          lista.map((u) => (u.id === editandoId ? { ...u, ...atualizado } : u))
        )
      } else {
        const criado = await criarUsuario({ name: nome, email })
        setUsuarios((lista) => [...lista, criado])
      }
      limparFormulario()
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  async function excluir(id) {
    setErro(null)
    try {
      await excluirUsuario(id)
      setUsuarios((lista) => lista.filter((u) => u.id !== id))
    } catch (e) {
      setErro(mensagemDeErro(e))
    }
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <main>
      <h1>Usuários</h1>

      {erro && <p style={{ color: 'crimson' }}>{erro}</p>}

      <form onSubmit={salvar}>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" required />
        <button type="submit">{editandoId ? 'Salvar' : 'Criar'}</button>
        {editandoId && <button type="button" onClick={limparFormulario}>Cancelar</button>}
      </form>

      {usuarios.length === 0 ? (
        <p>Nenhum usuário.</p>
      ) : (
        <ul>
          {usuarios.map((u, i) => (
            <li key={`${u.id}-${i}`}>
              {u.name} — {u.email}{' '}
              <button onClick={() => iniciarEdicao(u)}>Editar</button>{' '}
              <button onClick={() => excluir(u.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}