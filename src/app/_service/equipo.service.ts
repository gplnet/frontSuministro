import { Injectable } from '@angular/core';
import { Equipo } from './../_model/equipo';
import { HOST } from '../_shared/var.constant';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  url: string = `${HOST}/equipo`;
  equipoCambio = new Subject<Equipo[]>();


  constructor( private http: HttpClient) {

   }

  getListarEquipo(p:number, s:number) {
    return this.http.get<Equipo[]>(`${this.url }/listarPageable?page=${p}&size=${s}`);
  }

  getEquipoPorId(id: number){
     return this.http.get<Equipo>(`${this.url}/listar/${id}`);
  }

  registrar(equipo: Equipo){
    return this.http.post(`${this.url}/registrar`, equipo);
  }
  modificar(equipo: Equipo){
    return this.http.put(`${this.url}/actualizar`, equipo);
  }
  eliminar(equipo: Equipo){
    return this.http.delete(`${this.url}/eliminar/${equipo.Eqp_Ide}`);
  }
}
