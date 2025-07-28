import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import { ItemTreino } from "../treino/@ItemTreino";
import { ModalDeleteStudent } from "./ModalDeleteStudent";
import { formatDateToString, formatPhoneNumber, getDaysChecklist } from "../../hooks/useStudentSheet";

interface studentSheetProps {
  currentStudentSheet: AlunoType;
  openEdit: () => void;
  closeStudentSheet: () => void;
}
export const StudentSheet = ({ closeStudentSheet, openEdit, currentStudentSheet }: studentSheetProps) => {
  const [modalDelete, setModalDelete] = useState(false)

  function getLevels() {
    const getStudentInfoValue = (toCheck: string) => {
      return currentStudentSheet.nivel === toCheck
    }

    const levels = [
      { level: 'Iniciante', checked: getStudentInfoValue('Iniciante') },
      { level: 'Intermediário', checked: getStudentInfoValue('Intermediário') },
      { level: 'Avançado', checked: getStudentInfoValue('Avançado') },
    ]

    return levels
  }

  function handleSuccessDelete() {
    setModalDelete(false)
    closeStudentSheet()
  }

  const h3ClassName = 'text-[1.5rem] text-[var(--primaryColor)] font-normal'
  const labelClassName = 'font-bold'
  const infoSpanClassName = 'flex flex-row gap-1'
  const sectionClassName = 'flex flex-col items-center'
  const spanInfoTreino = 'flex flex-col items-start'
  const infoTreinoClassName = 'bg-[var(--secondaryColor)] rounded-[10px] border border-[var(--primaryColor)] flex flex-row justify-left pl-2 w-fit pr-4'

  return (<>
    <div className="student-sheet bg-[var(--secondaryColor)] flex flex-col items-center py-3">
      {modalDelete ? <ModalDeleteStudent
        actions={{
          cancel: () => setModalDelete(false),
          success: handleSuccessDelete
        }}
        student={{ _id: currentStudentSheet._id, name: currentStudentSheet.nome }} />
        : <span className='flex flex-col w-[97%] px-5 py-3 bg-white gap-5'>
          <h1 className="text-3xl text-[var(--primaryColor)] font-medium">Ficha do aluno</h1>
          <h2 className='text-[1.25rem] text-[var(--primaryColor)] font-bold'>{currentStudentSheet.nome}</h2>
          <div className="actions flex flex-row justify-center gap-2">
            <button
              className='btn btn-blue px-3 w-fit'
              type="button"
              onClick={openEdit}>
              Editar ficha
            </button>
            <button
              type="button"
              className='btn btn-red px-3 w-fit'
              onClick={() => setModalDelete(true)}>
              Deletar aluno
            </button>
          </div>
          <section className={sectionClassName}>
            <h3 className={h3ClassName}>Informações pessoais</h3>
            <div className='flex flex-col md:flex-row gap-2'>
              <span className={infoSpanClassName}>
                <p className={labelClassName}>Contato:</p>
                <p>{formatPhoneNumber(currentStudentSheet.contato)}</p>
              </span>

              <span className={infoSpanClassName}>
                <p className={labelClassName}>Data de nascimento:</p>
                <p>{formatDateToString(currentStudentSheet.dataNascimento)}</p>
              </span>
            </div>
          </section>

          <section className={sectionClassName}>
            <h3 className={h3ClassName}>Agenda</h3>
            <div className='flex flex-row gap-2'>
              {getDaysChecklist(currentStudentSheet.agenda).map(day => (
                <label className="checklist-circle"
                  key={day.day}
                  htmlFor={day.day}>
                  <input
                    type="checkbox"
                    id={day.day}
                    checked={day.checked}
                    disabled />
                  <span className="checkmark-circle"></span>
                  {day.day}
                </label>
              ))}
            </div>
          </section>

          <section className={sectionClassName}>
            <h3 className={h3ClassName}>Informações de treino</h3>
            <div className='levels flex flex-row gap-2'>
              {getLevels().map(level => (
                <label
                  htmlFor={level.level}
                  key={level.level}
                  className="checklist-circle">
                  <input
                    type="checkbox"
                    id={level.level}
                    checked={level.checked}
                    disabled />
                  <span className="checkmark-circle"></span>
                  {level.level}
                </label>
              ))}
            </div>
            <div className='w-full flex flex-col items-start'>
              <span className='flex flex-row gap-5 wrap-normal mt-2'>
                <span className={spanInfoTreino}>
                  <p className={labelClassName}>Professor:</p>
                  <p className={infoTreinoClassName}>{currentStudentSheet.professor}</p>
                </span>
                <span className={spanInfoTreino}>
                  <p className={labelClassName}>Data de inicio:</p>
                  <p className={infoTreinoClassName}>{formatDateToString(currentStudentSheet.dataInicio)}</p>
                </span>
                <span className={spanInfoTreino}>
                  <p className={labelClassName}>Data de revisão:</p>
                  <p className={infoTreinoClassName}>{formatDateToString(currentStudentSheet.dataRevisao)}</p>
                </span>
              </span>

              <span className={spanInfoTreino}>
                <p className={labelClassName}>Objetivo do aluno:</p>
                <p className={infoTreinoClassName}>{currentStudentSheet.objetivo}</p>
              </span>
              <span className={spanInfoTreino}>
                <p className={labelClassName}>Anaminese</p>
                <p className={infoTreinoClassName}>{currentStudentSheet.anaminese}</p>
              </span>
            </div>
          </section>

          <section>
            <h3 className={h3ClassName}>Perimetria</h3>
            <span className={spanInfoTreino}>
              <p className={labelClassName}>Data:</p>
              <p className={infoTreinoClassName}>{formatDateToString(currentStudentSheet.perimetria.data)}</p>
            </span>
            <div className='perimetria-list grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2 mt-2'>
              {currentStudentSheet.perimetria.medidas.map(itemPerimetria =>
                <span className='bg-[var(--primaryColor)] text-white py-2 px-3 flex flex-row justify-between rounded-[10px]'
                  key={itemPerimetria.nome}>
                  <p>{itemPerimetria.nome}:</p>
                  <p className='w-[5em] bg-white text-black px-2 rounded-[4px]'>{itemPerimetria.valor.toString()}</p>
                </span>
              )}
            </div>
          </section>

          <section className={sectionClassName}>
            <h3 className={h3ClassName}>Treino</h3>
            <div className='w-full flex flex-col items-center justify-center gap-3'>
              {currentStudentSheet.treino.length === 0 && <p>O aluno ainda não tem nenhum treino registrado</p>}
              {currentStudentSheet.treino.map(categoria => <ItemTreino
                key={categoria.categoria}
                studentList={categoria.exercicios}
                item={categoria} />
              )}
            </div>
          </section>
        </span>}
    </div>
  </>
  )
}
