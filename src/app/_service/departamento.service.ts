import { Injectable } from '@angular/core';
import { Departamento } from './../_model/departamento';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  url: string = `${HOST}/departamento`;
  departamentoCambio = new Subject<Departamento[]>();
  mensaje = new Subject<string>();


  constructor(private http: HttpClient) { }


  getListarDepartamento(p:number, s:number) {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Departamento[]>(`${this.url }/listarPageable?page=${p}&size=${s}`,{
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getListar() {
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Departamento[]>(`${this.url }/listar`, {
    headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  getDepartamentoPorId(id: number){
     let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
     return this.http.get<Departamento>(`${this.url}/listar/${id}`,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }

  registrar(departamento: Departamento){
    console.log('LOLA', departamento);
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.url}/registrar`, departamento ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  modificar(departamento: Departamento){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.put(`${this.url}/actualizar`, departamento ,{
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }
  eliminar(departamento: Departamento){
    let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.delete(`${this.url}/eliminar/${departamento.dpr_Ide}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
      });
  }



}
