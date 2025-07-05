import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import { ItemTreino } from "../treino/@ItemTreino";
import { StudentForm } from "../studentForm/@StudentForm";

export const StudentSheet = ({ student } : { student: AlunoType }) => {
  const [openForm, setOpenForm] = useState(false)

  function formatDateToString(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  function getDaysChecklist(){
    const getStudentInfoValue = (toCheck: string) => {
      return student.agenda.includes(toCheck)
    }

    const days = [
      {day: 'Segunda', checked: getStudentInfoValue('Segunda')},
      {day: 'Terça', checked: getStudentInfoValue('Terça')},
      {day: 'Quarta', checked: getStudentInfoValue('Quarta')},
      {day: 'Quinta', checked: getStudentInfoValue('Quinta')},
      {day: 'Sexta', checked: getStudentInfoValue('Sexta')},
      {day: 'Sábado', checked: getStudentInfoValue('Sábado')},
    ]


  return days
  }

  function getLevels(){
    const getStudentInfoValue = (toCheck: string) => {
      return student.nivel === toCheck
    }

    const levels = [
      {level: 'Iniciante', checked: getStudentInfoValue('Iniciante')},
      {level: 'Intermediário', checked: getStudentInfoValue('Intermediário')},
      {level: 'Avançado', checked: getStudentInfoValue('Avançado')},
    ]

    return levels
  }


  return (<>
    {openForm ? 
      <StudentForm 
      editingStudent={student}
      closeForm={()=>setOpenForm(false)}/> 
      : 
      <div className="student-sheet">
        <div className="actions">
          <button
          type="button"
          onClick={()=>setOpenForm(true)}>
            Editar ficha
          </button>
        </div>
        <section>
          <h2>Informações pessoais</h2>
          <div>
            <span>
              <p>Nome:</p>
              <p>{student.nome}</p>
            </span>

            <span>
              <p>Contato:</p>
              <p>{student.contato}</p>
            </span>

            <span>
              <p>Data de nascimento:</p>
              <p>{formatDateToString(student.dataNascimento)}</p>
            </span>
          </div>
        </section>

        <section>
          <h2>Agenda</h2>
          <div>
            {getDaysChecklist().map(day => (
              <label
              key={day.day}
              htmlFor={day.day}>
                <input
                type="checkbox"
                id={day.day}
                checked={day.checked}
                disabled/>
                {day.day}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2>Informações de treino</h2>
          <div className='levels'>
            {getLevels().map(level => (
              <label
              htmlFor={level.level}
              key={level.level}>
                <input
                type="checkbox"
                id={level.level}
                checked={level.checked}
                disabled/>
                {level.level}
              </label>
            ))}
          </div>
          <div>
          <span>
            <p>Professor:</p>
            <p>{student.professor}</p>
          </span>
          <span>
            <p>Data de inicio:</p>
            <p>{formatDateToString(student.dataInicio)}</p>
          </span>
          <span>
            <p>Data de revisão:</p>
            <p>{formatDateToString(student.dataRevisao)}</p>
          </span>
          <span>
            <p>Objetivo:</p>
            <p>{student.objetivo}</p>
          </span>
          <span>
            <p>Anaminese</p>
            <p>{student.anaminese}</p>
          </span>
          </div>
        </section>
        
        <section>
          <h2>Perimetria</h2>
          <span>
            <p>Data:</p>
            <p>{formatDateToString(student.perimetria.data)}</p>
          </span>
          <div>
            {student.perimetria.medidas.map(itemPerimetria => 
              <span
              key={itemPerimetria.nome}>
                <p>{itemPerimetria.nome}</p>
                <p>{itemPerimetria.valor}</p>
              </span>
            )}
          </div>
        </section>

        <section>
          <h2>Treino</h2>
          <div>
            {student.treino.length === 0 && <p>O aluno ainda não tem nenhum treino registrado</p>}
            {student.treino.map(categoria => <ItemTreino
              key={categoria.categoria}
              studentList={categoria.exercicios}
              item={categoria}/>
            )}
          </div>
        </section>
      </div>
    }
  </>
  )
}