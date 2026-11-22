export default function Feedback({ tipo, mensagem, onRetry }) {
  const papel = tipo === 'erro' ? 'alert' : 'status'

  return (
    <div className={`feedback feedback-${tipo}`} role={papel}>
      <p>{mensagem}</p>
      {tipo === 'erro' && onRetry ? (
        <button type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  )
}
