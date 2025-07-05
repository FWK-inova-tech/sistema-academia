import { itensPerimetria } from "./medidasPerimetria"

export const allStudents =  [
    {
        id: '001',
        nome: 'aluno1',
        objetivo: 'exemplo objetivo',
        dataNascimento: new Date(),
        professor: 'professor1',
        nivel: "Iniciante" as 'Iniciante' | 'Intermediário' | 'Avançado',
        contato: '22533000000',
        dataInicio: new Date(),
        dataRevisao: new Date(),
        anaminese: 'exemplo anaminese',
        agenda: ['Segunda'],
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
        nivel: "Intermediário" as 'Iniciante' | 'Intermediário' | 'Avançado',
        contato: '55000007777',
        dataInicio: new Date(),
        dataRevisao: new Date(),
        anaminese: 'exemplo anaminese',
        agenda: ['Quinta', 'Sexta'],
        treino: [
          {categoria: 'Quadril e Adutores',
            exercicios: [
              'Agachamento guiado',
              'Agachamento terra',]},
          {categoria: 'Panturrilha',
            exercicios: [
              'Sóleos',
              'Livre'
            ]
          },
        ],
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