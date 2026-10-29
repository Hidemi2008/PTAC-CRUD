// src/api.js — o único lugar do app que conhece a URL da API
const BASE_URL = 'https://jsonplaceholder.typicode.com'

export class ApiError extends Error {
  constructor(status, statusText, message) {
    super(message || `${status} ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
  }
}

async function requisicao(caminho, opcoes = {}) {
  const { signal, headers: headersDaChamada, body, ...resto } = opcoes
  const url = `${BASE_URL}${caminho}`

  const configuracoes = {
    ...resto,
    // padrão primeiro, headers da chamada depois: mesclam e podem sobrescrever
    headers: { 'Content-Type': 'application/json', ...headersDaChamada },
    ...(signal ? { signal } : {}),
  }
  if (body !== undefined) {
    configuracoes.body = JSON.stringify(body)
  }

  const resp = await fetch(url, configuracoes)
  if (!resp.ok) throw new ApiError(resp.status, resp.statusText)
  if (resp.status === 204) return null
  return await resp.json()
}

export async function apiGet(caminho, opcoes = {}) {
  return requisicao(caminho, { method: 'GET', ...opcoes })
}

export async function apiPost(caminho, body, opcoes = {}) {
  return requisicao(caminho, { method: 'POST', body, ...opcoes })
}

export async function apiPut(caminho, body, opcoes = {}) {
  return requisicao(caminho, { method: 'PUT', body, ...opcoes })
}

export async function apiDelete(caminho, opcoes = {}) {
  return requisicao(caminho, { method: 'DELETE', ...opcoes })
}