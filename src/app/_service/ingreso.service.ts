import { Injectable } from '@angular/core';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { Subject } from 'rxjs';
import { Suministro } from '../_model/suministro';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ingreso } from '../_model/ingreso';
import { Proceso } from '../_model/proceso';


@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  url: string = `${HOST}/suministro`;
  urlIngreso: string = `${HOST}/ingreso`;
  urlProceso: string = `${HOST}/proceso`;
  sumIngresoCambio = new Subject<Suministro[]>();
  mensaje = new Subject<string>();

  constructor(private http: HttpClient) { }


  getListar() {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Suministro[]>(`${this.url }/listar`, {
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
  getListarProcesos(){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Proceso[]>(`${this.urlProceso }/listar`, {
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getProcesoId(id: number){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Proceso>(`${this.urlProceso}/listar/${id}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getListarSuministroIngreso(p:number, s:number) {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Suministro[]>(`${this.url }/listarPageable?page=${p}&size=${s}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getSuministroIngresoPorId(id: number){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Suministro>(`${this.url}/listar/${id}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
  registrar(sIngreso: Ingreso) {
    console.log('LOLA', sIngreso);
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.urlIngreso}/registrar`, sIngreso ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  modificar(sIngreso: Ingreso){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.put(`${this.urlIngreso}/actualizar`, sIngreso ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }

  eliminar(sIngreso: Ingreso){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.delete(`${this.urlIngreso}/eliminar/${sIngreso.ing_ide}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }

  generarReporte(id: string){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get(`${this.urlIngreso}/generarReporte/${id}`,{
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });

  }
}
