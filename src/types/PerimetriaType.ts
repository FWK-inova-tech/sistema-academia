export interface PerimetriaType {
  data: Date;
  medidas: PerimetriaMedidaType[];
}

export interface PerimetriaMedidaType {
  nome: string;
  valor: number;
}