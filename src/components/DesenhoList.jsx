export default function DesenhoList({ desenhos }) {
  return (
    <ul className="desenho-list">
      {desenhos.map((desenho) => (
        <li key={desenho.id} className="desenho-card">
          <h3>{desenho.titulo}</h3>
          <p className="desenho-meta">
            {desenho.genero} - {desenho.anoLancamento} - {desenho.criador}
          </p>
          {desenho.sinopse ? <p>{desenho.sinopse}</p> : null}
        </li>
      ))}
    </ul>
  )
}
