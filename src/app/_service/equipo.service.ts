import { Injectable } from '@angular/core';
import { Equipo } from './../_model/equipo';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  url: string = `${HOST}/equipo`;
  equipoCambio = new Subject<Equipo[]>();
  mensaje = new Subject<string>();


  constructor( private http: HttpClient) {

   }

  getListarEquipo(p:number, s:number) {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Equipo[]>(`${this.url }/listarPageable?page=${p}&size=${s}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getEquipoPorId(id: number){
     let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
     return this.http.get<Equipo>(`${this.url}/listar/${id}`,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }

  registrar(equipo: Equipo){
    console.log('LOLA', equipo);
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.url}/registrar`, equipo ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  modificar(equipo: Equipo){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.put(`${this.url}/actualizar`, equipo ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  eliminar(equipo: Equipo){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.delete(`${this.url}/eliminar/${equipo.eqp_ide}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
}
