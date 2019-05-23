import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { Subject } from 'rxjs';
import { SuministroEgreso } from '../_model/suministroEgreso';
import { Suministro } from '../_model/suministro';

@Injectable({
  providedIn: 'root'
})
export class SuministroEgresoService {

  url: string = `${HOST}/suministro`;
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
  registrar(sEgreso: Suministro){
    console.log('LOLA', sEgreso);
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.url}/registrar`, sEgreso ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  modificar(sEgreso: Suministro){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.put(`${this.url}/actualizar`, sEgreso ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  eliminar(sEgreso: Suministro){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.delete(`${this.url}/eliminar/${sEgreso.sum_ide}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }

}
