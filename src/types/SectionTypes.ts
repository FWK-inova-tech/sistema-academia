export type SectionErrorType = {
  [key in sectionType]?: string;
}

export type sectionType = 
  'pessoais' | 'agenda' | 'infoTreino' | 'perimetria' | 'treino'
