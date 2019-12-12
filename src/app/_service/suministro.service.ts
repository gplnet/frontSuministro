import { Injectable } from '@angular/core';
import { Suministro } from './../_model/suministro';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SuministroService {

  url: string = `${HOST}/suministro`;
  suministroCambio = new Subject<Suministro[]>();
  mensaje = new Subject<string>();


  constructor( private http: HttpClient) {

   }

  getListarSuministro(p:number, s:number) {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Suministro[]>(`${this.url }/listarPageable?page=${p}&size=${s}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getSuministroPorId(id: number){
     let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
     return this.http.get<Suministro>(`${this.url}/listar/${id}`,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }

  registrar(suministro: Suministro){
    console.log('LOLA', suministro);
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.url}/registrar`, suministro ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  modificar(suministro: Suministro){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.put(`${this.url}/actualizar`, suministro ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  eliminar(suministro: Suministro){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.delete(`${this.url}/eliminar/${suministro.sum_ide}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  generarReporte(nombre: string){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get(`${this.url}/generarReporte/${nombre}`,{
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });

  }
}
