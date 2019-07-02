import { SuministroEgreso } from './suministroEgreso';
import { Departamento } from './departamento';

export class Egreso {
  public egr_ide: number;
  public egr_fec: Date;
  public suministroEgreso: SuministroEgreso[] = [];
  public departamento: Departamento;

}
