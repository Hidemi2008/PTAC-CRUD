export default function ListaUsuarios({ usuarios, onEditar, onExcluir }) {
  return (
    <ul>
      {usuarios.map((u) => (
        <li key={u.id}>
          {u.name}
          <button onClick={() => onEditar(u)}>Editar</button>
          <button onClick={() => onExcluir(u.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  )
}