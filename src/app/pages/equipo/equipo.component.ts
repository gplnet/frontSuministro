import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipoService } from 'src/app/_service/equipo.service';
import { Equipo } from 'src/app/_model/equipo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  lista: Equipo[] = [];
  displayedColumns = ['id', 'marca', 'modelo', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Equipo>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;

  constructor(private eqs: EquipoService) { }

  ngOnInit() {
    this.eqs.getListarEquipo(0,5).subscribe(data => {
      /* console.log(data);
      this.lista = data;
      console.log(this.lista); */
      let equipos = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;

      this.dataSource = new MatTableDataSource(equipos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.eqs.equipoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    this.eqs.getListarEquipo(e.pageIndex, e.pageSize).subscribe(data =>{
      let equipos = JSON.parse(JSON.stringify(data)).content;
      this.cantidad = JSON.parse(JSON.stringify(data)).totalElements;
      this.dataSource = new MatTableDataSource(equipos);

      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    });
  }

}
