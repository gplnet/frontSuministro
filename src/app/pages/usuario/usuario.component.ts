import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../_model/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuarioService } from '../../_service/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: [
    `
    .example-container {
      display: flex;
      flex-direction: column;
      min-width: 300px;
    }
    
    .example-header {
      min-height: 64px;
      padding: 8px 24px 0;
    }
    
    .mat-form-field {
      font-size: 14px;
      width: 100%;
    }
    
    .mat-table {
      overflow: auto;
      max-height: 500px;
    }
    
    `
  ]
})
export class UsuarioComponent implements OnInit {

  displayedColumns = ['id', 'usuario', 'rol', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Usuario>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;


  constructor(private snackBar: MatSnackBar,
              private usuarioService: UsuarioService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.usuarioService.getListarUsuario(0, 5).subscribe( data => {
      console.log(data);
      let usuarios = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(usuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
    this.usuarioService.usuarioCambio.subscribe(data => {
      let usuarios = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(usuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.usuarioService.mensaje.subscribe( data => {
      this.snackBar.open(data, null, {duration: 2000});
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  mostrarMas(e){
    this.usuarioService.getListarUsuario(e.pageIndex, e.pageSize).subscribe(data => {
      let usuarios = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;
      this.dataSource = new MatTableDataSource(usuarios);
    });
  }

}
