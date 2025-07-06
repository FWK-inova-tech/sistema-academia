import { useAppSelector } from "../../stores/appStore";
import type { AlunoType } from "../../types/AlunoType"
import { ItemTreino } from "../treino/@ItemTreino";

interface studentSheetProps {
  openEdit: () => void;
}
export const StudentSheet = ({ openEdit } : studentSheetProps) => {
  const currentStudentSheet = useAppSelector((state)=> state.students.currentStudentSheet) as AlunoType

  function formatDateToString(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  function getDaysChecklist(){
    const getStudentInfoValue = (toCheck: string) => {
      return currentStudentSheet.agenda.includes(toCheck)
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
      return currentStudentSheet.nivel === toCheck
    }

    const levels = [
      {level: 'Iniciante', checked: getStudentInfoValue('Iniciante')},
      {level: 'Intermediário', checked: getStudentInfoValue('Intermediário')},
      {level: 'Avançado', checked: getStudentInfoValue('Avançado')},
    ]

    return levels
  }


  return (<>
      <div className="student-sheet">
        <div className="actions">
          <button
          type="button"
          onClick={openEdit}>
            Editar ficha
          </button>
        </div>
        <section>
          <h2>Informações pessoais</h2>
          <div>
            <span>
              <p>Nome:</p>
              <p>{currentStudentSheet.nome}</p>
            </span>

            <span>
              <p>Contato:</p>
              <p>{currentStudentSheet.contato}</p>
            </span>

            <span>
              <p>Data de nascimento:</p>
              <p>{formatDateToString(currentStudentSheet.dataNascimento)}</p>
            </span>
          </div>
        </section>

        <section>
          <h2>Agenda</h2>
          <div>
            {getDaysChecklist().map(day => (
              <label className="checklist-circle"
              key={day.day}
              htmlFor={day.day}>
                <input
                type="checkbox"
                id={day.day}
                checked={day.checked}
                disabled/>
                <span className="checkmark-circle"></span>
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
              key={level.level}
              className="checklist-circle">
                <input
                type="checkbox"
                id={level.level}
                checked={level.checked}
                disabled/>
                <span className="checkmark-circle"></span>
                {level.level}
              </label>
            ))}
          </div>
          <div>
          <span>
            <p>Professor:</p>
            <p>{currentStudentSheet.professor}</p>
          </span>
          <span>
            <p>Data de inicio:</p>
            <p>{formatDateToString(currentStudentSheet.dataInicio)}</p>
          </span>
          <span>
            <p>Data de revisão:</p>
            <p>{formatDateToString(currentStudentSheet.dataRevisao)}</p>
          </span>
          <span>
            <p>Objetivo:</p>
            <p>{currentStudentSheet.objetivo}</p>
          </span>
          <span>
            <p>Anaminese</p>
            <p>{currentStudentSheet.anaminese}</p>
          </span>
          </div>
        </section>
        
        <section>
          <h2>Perimetria</h2>
          <span>
            <p>Data:</p>
            <p>{formatDateToString(currentStudentSheet.perimetria.data)}</p>
          </span>
          <div>
            {currentStudentSheet.perimetria.medidas.map(itemPerimetria => 
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
            {currentStudentSheet.treino.length === 0 && <p>O aluno ainda não tem nenhum treino registrado</p>}
            {currentStudentSheet.treino.map(categoria => <ItemTreino
              key={categoria.categoria}
              studentList={categoria.exercicios}
              item={categoria}/>
            )}
          </div>
        </section>
      </div>
  </>
  )
}