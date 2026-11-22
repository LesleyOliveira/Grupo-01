import { useCallback, useEffect, useState } from 'react'
import DesenhoForm from '../components/DesenhoForm.jsx'
import DesenhoList from '../components/DesenhoList.jsx'
import Feedback from '../components/Feedback.jsx'
import { criarDesenho, listarDesenhos } from '../api/desenhosApi.js'

const MENSAGEM_ERRO_LISTAGEM = 'Não foi possível carregar os desenhos.'
const MENSAGEM_ERRO_CADASTRO = 'Não foi possível cadastrar o desenho.'

export default function CatalogoDesenhos() {
  const [desenhos, setDesenhos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroListagem, setErroListagem] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erroCadastro, setErroCadastro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  const carregarDesenhos = useCallback(async () => {
    setCarregando(true)
    setErroListagem(null)
    try {
      const lista = await listarDesenhos()
      setDesenhos(lista)
    } catch {
      setErroListagem(MENSAGEM_ERRO_LISTAGEM)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarDesenhos()
  }, [carregarDesenhos])

  async function cadastrar(payload) {
    setEnviando(true)
    setErroCadastro(null)
    setSucesso(false)
    try {
      const criado = await criarDesenho(payload)
      setDesenhos((atuais) => [...atuais, criado])
      setSucesso(true)
      return true
    } catch {
      setErroCadastro(MENSAGEM_ERRO_CADASTRO)
      return false
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="catalogo">
      <header className="catalogo-cabecalho">
        <h1>Catálogo de Desenhos Animados</h1>
        <p>Listagem e cadastro dos desenhos favoritos do grupo.</p>
      </header>

      <div className="catalogo-conteudo">
        <section aria-label="Desenhos cadastrados">
          <h2>Desenhos</h2>

          {carregando ? (
            <Feedback tipo="carregando" mensagem="Carregando desenhos..." />
          ) : null}

          {!carregando && erroListagem ? (
            <Feedback
              tipo="erro"
              mensagem={erroListagem}
              onRetry={carregarDesenhos}
            />
          ) : null}

          {!carregando && !erroListagem && desenhos.length === 0 ? (
            <Feedback tipo="vazio" mensagem="Nenhum desenho encontrado." />
          ) : null}

          {!carregando && !erroListagem && desenhos.length > 0 ? (
            <DesenhoList desenhos={desenhos} />
          ) : null}
        </section>

        <section aria-label="Cadastrar desenho">
          <h2>Novo desenho</h2>

          {sucesso ? (
            <Feedback tipo="sucesso" mensagem="Desenho cadastrado com sucesso" />
          ) : null}

          {erroCadastro ? (
            <Feedback tipo="erro" mensagem={erroCadastro} />
          ) : null}

          <DesenhoForm onCadastrar={cadastrar} enviando={enviando} />
        </section>
      </div>
    </main>
  )
}
