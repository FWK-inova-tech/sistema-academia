import { useState } from "react";
import type { AlunoType } from "../types/AlunoType";
import type { PerimetriaType } from "../types/PerimetriaType";
import type { TreinoType } from "../types/TreinoType";
import type { SectionErrorType, sectionType } from "../types/SectionTypes";

export function useStudentForm(student: Omit<AlunoType, '_id'> | AlunoType) {
  const [activeSections, setActiveSections] = useState<sectionType[]>([])
  const [sectionErrors, setSectionErrors] = useState<SectionErrorType>({})

  const [infoPessoais, setInfoPessoais] = useState<Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>>({
    contato: student.contato,
    dataNascimento: student.dataNascimento,
    nome: student.nome
  })

  const [agenda, setAgenda] = useState(student.agenda)

  const [infosTreino, setInfosTreino] = useState<Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>>({
    anaminese: student.anaminese,
    dataInicio: student.dataInicio,
    dataRevisao: student.dataRevisao,
    nivel: student.nivel,
    objetivo: student.objetivo,
    professor: student.professor
  })

  const [perimetria, setPerimetria] = useState<PerimetriaType>
    ({
      medidas: student.perimetria.medidas,
      data: student.perimetria.data
    })

  const [treino, setTreino] = useState<TreinoType[]>(student.treino)

  return {
    infoPessoais, agenda, infosTreino, perimetria, treino, activeSections, sectionErrors,
    setInfoPessoais, setAgenda, setInfosTreino, setPerimetria, setTreino, setActiveSections, setSectionErrors
  }
}
