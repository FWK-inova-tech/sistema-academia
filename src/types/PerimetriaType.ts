export interface PerimetriaType {
  data: string;
  medidas: PerimetriaMedidaType[];
}

export interface PerimetriaMedidaType {
  nome: string;
  valor: number;
}