export function formatDateToString(date: Date): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      return 'Data inválida'
    }

    return parsedDate.toLocaleDateString('pt-BR')
  }

export function getDaysChecklist(agenda: string[]){
    const getStudentInfoValue = (toCheck: string) => {
      return agenda.includes(toCheck)
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

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned[2]} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }

  return phone
}
