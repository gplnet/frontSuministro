import { Injectable } from '@angular/core';
import { Equipo } from './../_model/equipo';
import { HOST } from '../_shared/var.constant';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  url: string = `${HOST}/equipo`;


  constructor( private http: HttpClient) {

   }

  getListarEquipo() {
    return this.http.get<Equipo[]>(`${this.url }/listar`);
  }
}
