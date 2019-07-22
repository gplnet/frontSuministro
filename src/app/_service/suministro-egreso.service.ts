import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { Subject } from 'rxjs';

import { Suministro } from '../_model/suministro';
import { Egreso } from '../_model/egreso';


@Injectable({
  providedIn: 'root'
})
export class SuministroEgresoService {

  url: string = `${HOST}/suministro`;
  urlEgreso: string = `${HOST}/egreso`;
  sumEgCambio = new Subject<Suministro[]>();
  mensaje = new Subject<string>();

  constructor(private http: HttpClient) { }


  getListar() {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Suministro[]>(`${this.url }/listar`, {
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getListarSuministroEgreso(p:number, s:number) {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Suministro[]>(`${this.url }/listarPageable?page=${p}&size=${s}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

    getSuministroEgresoPorId(id: number){
      let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
      return this.http.get<Suministro>(`${this.url}/listar/${id}`,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  registrar(sEgreso: Egreso) {
    console.log('LOLA', sEgreso);
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.urlEgreso}/registrar`, sEgreso ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  modificar(sEgreso: Egreso){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.put(`${this.urlEgreso}/actualizar`, sEgreso ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  eliminar(sEgreso: Egreso){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.delete(`${this.urlEgreso}/eliminar/${sEgreso.egr_ide}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }

}
