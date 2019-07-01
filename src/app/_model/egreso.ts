import { SuministroEgreso } from './suministroEgreso';
import { Departamento } from './departamento';

export class Egreso {
  public egr_ide: number;
  public fecha: Date;
  public suministroEgreso: SuministroEgreso[] = [];
  public departamento: Departamento;

}
