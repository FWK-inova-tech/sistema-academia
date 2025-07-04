import { useAppSelector } from "../../stores/appStore"

export const Students = () => {
  const students = useAppSelector((state)=> state.students.studentsList)
  const loading = useAppSelector((state)=> state.students.loading)

  

  return (
    <main>
      { loading ? 
        <div className="loading-text">
          <p>{loading}</p>
        </div>
      : 
        <table className="students-list">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.nome}</td>
                <td className="student-actions">
                  <button type='button'>Abrir ficha</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </main>
  )
}