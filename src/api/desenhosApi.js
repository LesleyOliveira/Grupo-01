import { apiClient } from './apiClient.js'

export async function listarDesenhos() {
  const { data } = await apiClient.get('/desenhos')
  return data
}

export async function criarDesenho(desenho) {
  const { data } = await apiClient.post('/desenhos', desenho)
  return data
}
