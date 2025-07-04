import { itensPerimetria } from "./medidasPerimetria"

export const allStudents =  [
    {
        id: '001',
        nome: 'aluno1',
        objetivo: 'exemplo objetivo',
        dataNascimento: new Date(),
        professor: 'professor1',
        nivel: "Iniciante",
        contato: '77 7 7777-7777',
        dataInicio: new Date(),
        dataRevisao: new Date(),
        anaminese: 'exemplo anaminese',
        agenda: [],
        treino: [],
        perimetria: { 
        data: new Date(),
        medidas: itensPerimetria} 
      },
      {
        id: '002',
        nome: 'aluno2',
        objetivo: 'exemplo objetivo',
        dataNascimento: new Date(),
        professor: 'professor2',
        nivel: "Intermediário",
        contato: '77 7 7777-7777',
        dataInicio: new Date(),
        dataRevisao: new Date(),
        anaminese: 'exemplo anaminese',
        agenda: [],
        treino: [],
        perimetria: { 
        data: new Date(),
        medidas: itensPerimetria} 
      }
  ]

export const listAllStudents = [
  {id: '001',
  nome: 'aluno1',},
  { id: '002',
  nome: 'aluno2',}
]