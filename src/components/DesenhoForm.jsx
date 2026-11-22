import { useState } from 'react'
import { validarDesenho } from './validarDesenho.js'

const VALORES_INICIAIS = {
  titulo: '',
  genero: '',
  anoLancamento: '',
  criador: '',
  sinopse: '',
}

export default function DesenhoForm({ onCadastrar, enviando }) {
  const [valores, setValores] = useState(VALORES_INICIAIS)
  const [erros, setErros] = useState({})

  function alterar(campo, valor) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }))
    setErros((atuais) => ({ ...atuais, [campo]: undefined }))
  }

  async function enviar(evento) {
    evento.preventDefault()

    const encontrados = validarDesenho(valores)
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados)
      return
    }

    const cadastrou = await onCadastrar({
      titulo: valores.titulo.trim(),
      genero: valores.genero.trim(),
      anoLancamento: Number(valores.anoLancamento),
      criador: valores.criador.trim(),
      sinopse: valores.sinopse.trim(),
    })

    if (cadastrou) {
      setValores(VALORES_INICIAIS)
      setErros({})
    }
  }

  return (
    <form className="desenho-form" onSubmit={enviar} noValidate>
      <label>
        Título
        <input
          name="titulo"
          value={valores.titulo}
          onChange={(e) => alterar('titulo', e.target.value)}
        />
        {erros.titulo ? <span className="erro-campo">{erros.titulo}</span> : null}
      </label>

      <label>
        Gênero
        <input
          name="genero"
          value={valores.genero}
          onChange={(e) => alterar('genero', e.target.value)}
        />
        {erros.genero ? <span className="erro-campo">{erros.genero}</span> : null}
      </label>

      <label>
        Ano de lançamento
        <input
          name="anoLancamento"
          inputMode="numeric"
          value={valores.anoLancamento}
          onChange={(e) => alterar('anoLancamento', e.target.value)}
        />
        {erros.anoLancamento ? (
          <span className="erro-campo">{erros.anoLancamento}</span>
        ) : null}
      </label>

      <label>
        Criador
        <input
          name="criador"
          value={valores.criador}
          onChange={(e) => alterar('criador', e.target.value)}
        />
        {erros.criador ? <span className="erro-campo">{erros.criador}</span> : null}
      </label>

      <label>
        Sinopse (opcional)
        <textarea
          name="sinopse"
          rows="4"
          value={valores.sinopse}
          onChange={(e) => alterar('sinopse', e.target.value)}
        />
        {erros.sinopse ? <span className="erro-campo">{erros.sinopse}</span> : null}
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Cadastrando...' : 'Cadastrar desenho'}
      </button>
    </form>
  )
}
