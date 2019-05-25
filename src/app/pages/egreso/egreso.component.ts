import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SuministroEgresoService } from 'src/app/_service/suministro-egreso.service';
import { Suministro } from 'src/app/_model/suministro';
import { DepartamentoService } from 'src/app/_service/departamento.service';
import { Departamento } from 'src/app/_model/departamento';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrls: ['./egreso.component.css']
})
export class EgresoComponent implements OnInit {

  displayedColumns = ['id', 'marca', 'modelo', 'estado', 'acciones'];
  dataSource: MatTableDataSource<Suministro>;

  suministros:Suministro [] = [];
  departamentos:Departamento [] = [];


  constructor(private sS: SuministroEgresoService, private sD: DepartamentoService) { }

  ngOnInit() {
    this.listarSuministrosEgresos();
    this.listarDepartamento();
  }

  listarSuministrosEgresos(){
    this.sS.getListar().subscribe( data => {
      console.log(data);
      this.suministros = data;

    });
  }

  listarDepartamento(){
    this.sD.getListar().subscribe(data =>{
      this.departamentos = data;
      console.log(data);

    });

  }

}
