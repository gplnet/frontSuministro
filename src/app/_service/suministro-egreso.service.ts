import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { Subject } from 'rxjs';
import { SuministroEgreso } from '../_model/suministroEgreso';

@Injectable({
  providedIn: 'root'
})
export class SuministroEgresoService {

  url: string = `${HOST}/segreso`;
  sumEgCambio = new Subject<SuministroEgreso[]>();
  mensaje = new Subject<string>();

  constructor(private http: HttpClient) { }

  getListarSuministroEgreso(p:number, s:number) {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<SuministroEgreso[]>(`${this.url }/listarPageable?page=${p}&size=${s}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getSuministroEgresoPorId(id: number){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<SuministroEgreso>(`${this.url}/listar/${id}`,{
     headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
     });
 }
 registrar(sEgreso: SuministroEgreso){
  console.log('LOLA', sEgreso);
  let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
  return this.http.post(`${this.url}/registrar`, sEgreso ,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
}
modificar(sEgreso: SuministroEgreso){
  let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
  return this.http.put(`${this.url}/actualizar`, sEgreso ,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
}
eliminar(sEgreso: SuministroEgreso){
  let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
  return this.http.delete(`${this.url}/eliminar/${sEgreso.seg_ide}`, {
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
}

}
