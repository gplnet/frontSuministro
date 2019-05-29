import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SuministroEgresoService } from 'src/app/_service/suministro-egreso.service';
import { Suministro } from 'src/app/_model/suministro';
import { DepartamentoService } from 'src/app/_service/departamento.service';
import { Departamento } from 'src/app/_model/departamento';
import { SuministroEgreso } from 'src/app/_model/suministroEgreso';
import { MatSnackBar } from '@angular/material';
import { Egreso } from 'src/app/_model/egreso';

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
  suministroEgreso: SuministroEgreso [] = [];

  idDepartamentoSeleccionado: number;
  idSuminstroSeleccionado: number;

  mensaje: string;
  fechaSeleccionada: Date = new Date();



  constructor(private sS: SuministroEgresoService,
              private sD: DepartamentoService,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.listarSuministrosEgresos();
    this.listarDepartamento();

    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
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
  agregar(){
    console.log(this. idSuminstroSeleccionado);
    console.log(this.idDepartamentoSeleccionado);
    if(this. idSuminstroSeleccionado > 0  && this.idDepartamentoSeleccionado > 0 ){
      let detalle = new Egreso();
      let idV = 0;
      detalle.departamento.dpr_Ide = this.idDepartamentoSeleccionado;
      detalle.fecha = this.fechaSeleccionada;
      detalle.suministroEgreso.suministro.sum_ide = this.idSuminstroSeleccionado;
      detalle.suministroEgreso.seg_can = 0;
      detalle.suministroEgreso.seg_ide = idV;


      //this.suministroEgreso.push(detalle);


    }else{
      this.mensaje = `Debe agregar un diagnóstico y tramiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

}
