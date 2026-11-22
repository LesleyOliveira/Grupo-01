const ANO_MINIMO = 1900
const LIMITE_SINOPSE = 500

export function validarDesenho(valores) {
  const erros = {}
  const anoAtual = new Date().getFullYear()

  if (!valores.titulo?.trim()) {
    erros.titulo = 'Título é obrigatório.'
  }
  if (!valores.genero?.trim()) {
    erros.genero = 'Gênero é obrigatório.'
  }
  if (!valores.criador?.trim()) {
    erros.criador = 'Criador é obrigatório.'
  }

  const anoTexto = String(valores.anoLancamento ?? '').trim()
  const ano = Number(anoTexto)

  if (!anoTexto) {
    erros.anoLancamento = 'Ano de lançamento é obrigatório.'
  } else if (!Number.isInteger(ano) || ano < ANO_MINIMO || ano > anoAtual) {
    erros.anoLancamento = `Informe um ano entre ${ANO_MINIMO} e ${anoAtual}.`
  }

  if ((valores.sinopse ?? '').trim().length > LIMITE_SINOPSE) {
    erros.sinopse = `A sinopse deve ter no máximo ${LIMITE_SINOPSE} caracteres.`
  }

  return erros
}
