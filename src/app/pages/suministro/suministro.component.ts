import { Component, OnInit, ViewChild } from '@angular/core';
import { Suministro } from 'src/app/_model/suministro';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SuministroService } from 'src/app/_service/suministro.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TOKEN_NAME } from '../../_shared/var.constant';
import { tokenNotExpired } from 'angular2-jwt';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-suministro',
  templateUrl: './suministro.component.html',
  styleUrls: ['./suministro.component.css']
})
export class SuministroComponent implements OnInit {

  isLoading = false;

  lista: Suministro[] = [];
  displayedColumns = ['id', 'cantidad', 'codigo', 'color', 'modelo', 'volumen', 'acciones'];
  dataSource: MatTableDataSource<Suministro>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;

  constructor(private sum: SuministroService, private snackBar: MatSnackBar, public route: ActivatedRoute) { }

  ngOnInit() {
    this.sum.getListarSuministro(0,5).subscribe(data => {
      /* console.log(data);
      this.lista = data;
      console.log(this.lista); */
      console.log(data);
      let suministros = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(suministros);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.sum.suministroCambio.subscribe(data => {
      let suministros = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(suministros);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.sum.mensaje.subscribe( data => {
      this.snackBar.open(data, null, {duration: 2000});
    });


    /* setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.lista);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000); */


  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  mostrarMas(e){
    this.sum.getListarSuministro(e.pageIndex, e.pageSize).subscribe(data =>{
      let suministros = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;
      this.dataSource = new MatTableDataSource(suministros);

      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    });
  }
  eliminar(suministro: Suministro): void {
    console.log(suministro);
    this.sum.eliminar(suministro).subscribe(data => {
      if (data === 1) {
        this.sum.getListarSuministro(0, 10).subscribe(suministros => {
          this.sum.suministroCambio.next(suministros);
          this.sum.mensaje.next("Se elimino correctamente");
        });
      } else {
        this.sum.mensaje.next("No se pudo eliminar");
      }
    });
  }
  verStocks(){
    console.log('ver stocks');
    let username: string = '';
    let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    if (tokenNotExpired(TOKEN_NAME, token.access_token)) {
      const decodedToken = decode(token.access_token);
      username = decodedToken.user_name;
    }
    this.isLoading = true;
    this.sum.generarReporte(username).subscribe( data =>{
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'suministros.pdf';
      a.click();
      this.isLoading = false;
      return url;

    });
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

}
