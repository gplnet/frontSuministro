import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SuministroEgresoService } from 'src/app/_service/suministro-egreso.service';
import { Suministro } from 'src/app/_model/suministro';
import { DepartamentoService } from 'src/app/_service/departamento.service';
import { Departamento } from 'src/app/_model/departamento';
import { SuministroEgreso } from 'src/app/_model/suministroEgreso';
import { MatSnackBar } from '@angular/material';
import { Egreso } from 'src/app/_model/egreso';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

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

  myControl: FormControl = new FormControl();

  idDepartamentoSeleccionado: number;
  idSuminstroSeleccionado: number;

  mensaje: string;
  fechaSeleccionada: Date = new Date();

  filteredOptions: Observable<any[]>;

  suministroSeleccionado: Suministro;



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


    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(null), map(val => this.filter(val)) );
  }


  filter(val: any) {
    if (val != null && val.sum_ide > 0) {
      return this.suministros.filter(option =>
        option.sum_cod.toLowerCase().includes(val.sum_cod.toLowerCase()) || option.sum_col.toLowerCase().includes(val.sum_col.toLowerCase()) || option.sum_mdl.includes(val.sum_mdl));
    } else {
      return this.suministros.filter(option =>
        option.sum_cod.toLowerCase().includes(val.toLowerCase()) || option.sum_col.toLowerCase().includes(val.toLowerCase()) || option.sum_mdl.includes(val));
    }
  }

  displayFn(val: Suministro) {
    return val ? `${val.sum_cod} ${val.sum_col}` : val;
  }

  seleccionarsuministro(e){
    this.suministroSeleccionado = e.option.value;
    console.log(this.suministroSeleccionado);
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
      this.mensaje = `Debe agregar suminsitro`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

}
