import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartamentoService } from '../../_service/departamento.service';
import { Departamento } from 'src/app/_model/departamento';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {

  lista: Departamento[] = [];
  displayedColumns = ['id', 'nombre', 'responsable', 'acciones'];
  dataSource: MatTableDataSource<Departamento>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;

  constructor(private dpt: DepartamentoService, private snackBar: MatSnackBar,public route: ActivatedRoute) { }

  ngOnInit() {
    this.dpt.getListarDepartamento(0,5).subscribe(data => {
       console.log(data);
      this.lista = data;
      console.log(this.lista); 
      console.log(data);
      let departamentos = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(departamentos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.dpt.departamentoCambio.subscribe(data => {
      let departamentos = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(departamentos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.dpt.mensaje.subscribe( data => {
      this.snackBar.open(data, null, {duration: 2000});
    });
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  mostrarMas(e){
    this.dpt.getListarDepartamento(e.pageIndex, e.pageSize).subscribe(data =>{
      let departamentos = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;
      this.dataSource = new MatTableDataSource(departamentos);

      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    });
  }

  eliminar(departamento: Departamento): void {
    console.log(departamento);
    this.dpt.eliminar(departamento).subscribe(data => {
      if (data === 1) {
        this.dpt.getListarDepartamento(0, 10).subscribe(departamentos => {
          this.dpt.departamentoCambio.next(departamentos);
          this.dpt.mensaje.next("Se elimino correctamente");
        });
      } else {
        this.dpt.mensaje.next("No se pudo eliminar");
      }
    });
  }

}
