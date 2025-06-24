export interface Perimetria {
  data: Date;
  perimetriaMedidas: PerimetriaMedida[];
}

interface PerimetriaMedida {
  medida: string;
  valor: number;
}