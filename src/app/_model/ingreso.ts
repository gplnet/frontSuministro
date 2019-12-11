import { SuministroIngreso } from './suministroIngreso';
import { Proceso } from './proceso';
export class Ingreso {
    public ing_ide: number;
    public ing_fec: string;
    public suministroIngreso: SuministroIngreso [] = [];
    public proceso: Proceso;

    constructor(){}
}