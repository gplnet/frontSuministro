import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SuministroEgresoService } from 'src/app/_service/suministro-egreso.service';
import { Suministro } from 'src/app/_model/suministro';
import { DepartamentoService } from 'src/app/_service/departamento.service';
import { Departamento } from 'src/app/_model/departamento';
import { SuministroEgreso } from 'src/app/_model/suministroEgreso';
import { MatSnackBar, MatInput } from '@angular/material';
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

  @ViewChild('depart') depart: ElementRef;
  @ViewChild('suminst') suminst: ElementRef;


  displayedColumns = ['id', 'descripcion', 'modelo', 'departamento','cantidad', 'acciones'];
  dataSource: MatTableDataSource<Egreso>;

  suministros:Suministro [] = [];
  departamentos:Departamento [] = [];
  suministroEgreso: Egreso [] = [];

  myControl: FormControl = new FormControl();
  myControlDepart: FormControl = new FormControl();


  mensaje: string;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  filteredOptions: Observable<any[]>;
  filteredOptionsDepart: Observable<any[]>;

  suministroSeleccionado: Suministro;
  departamentoSeleccionado: Departamento;



  constructor(private sS: SuministroEgresoService,
              private sD: DepartamentoService,
              public snackBar: MatSnackBar) {
                this.dataSource = new MatTableDataSource<Egreso>();
              }

  ngOnInit() {
    this.listarSuministrosEgresos();
    this.listarDepartamento();

    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);


    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(null), map(val => this.filter(val)) );
    this.filteredOptionsDepart = this.myControlDepart.valueChanges.pipe(startWith(null), map(val => this.filterDepart(val)) );
  }


  filter(val: any) {
    //console.log(val);
    if (val != null && val.sum_ide > 0) {
      //console.log(val);
      return this.suministros.filter(option =>
        option.sum_cod.toLowerCase().includes(val.sum_cod.toLowerCase()) || option.sum_col.toLowerCase().includes(val.sum_col.toLowerCase()) || option.sum_mdl.includes(val.sum_mdl));
      } else {
        //console.log(val);
      return this.suministros.filter(option =>
        option.sum_cod.toLowerCase().includes(val.toLowerCase()) || option.sum_col.toLowerCase().includes(val.toLowerCase()) || option.sum_mdl.includes(val));
    }
  }
  filterDepart(val: any) {
    if (val != null && val.dpr_Ide > 0) {
      //console.log(val);
      return this.departamentos.filter(option =>
        option.dpr_Nom.toLowerCase().includes(val.dpr_Nom.toLowerCase()) || option.dpr_Res.toLowerCase().includes(val.dpr_Res.toLowerCase()) );
    } else {
      //console.log(val);
      return this.departamentos.filter(option =>
        option.dpr_Res.toLowerCase().includes(val.toLowerCase()) || option.dpr_Res.toLowerCase().includes(val.toLowerCase()));
    }
  }

  displayFn(val: Suministro) {
    return val ? `${val.sum_cod} ${val.sum_col}` : val;
  }
  displayFnDepart(val: Departamento){
    return val ? `${val.dpr_Nom} ${val.dpr_Res}` : val;
  }

  seleccionarsuministro(e){
    this.suministroSeleccionado = e.option.value;
    console.log(this.suministroSeleccionado);
  }
  seleccionarDepart(e){
    this.departamentoSeleccionado = e.option.value;
    console.log(this.departamentoSeleccionado);
  }

  listarSuministrosEgresos(){
    this.sS.getListar().subscribe( data => {
      //console.log(data);
      this.suministros = data;

    });
  }

  listarDepartamento(){
    this.sD.getListar().subscribe(data =>{
      this.departamentos = data;
      ///console.log(data);

    });

  }
  aceptar(){

  }
  estadoBotonRegistrar(){
    return (this.suministroEgreso.length === 0 );
  }

  agregar(){
    console.log(this. departamentoSeleccionado);
    console.log(this.suministroSeleccionado);
    if ((this. departamentoSeleccionado === undefined && this.suministroSeleccionado === undefined) || (this. departamentoSeleccionado === null && this.suministroSeleccionado === null)){

      this.mensaje = `Debe seleccionar suminsitro y un departamento.`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });


    } else {
      if( this. suministroSeleccionado.sum_ide > 0  && this.departamentoSeleccionado.dpr_Ide > 0 ){
        let idV = 0;
        let detalle = new Egreso();
        let sEgrso = new SuministroEgreso();
        sEgrso.suministro = this.suministroSeleccionado;
        sEgrso.seg_can = 0;
        sEgrso.seg_ide = idV;


        detalle.departamento  = this.departamentoSeleccionado;

        detalle.fecha = this.fechaSeleccionada;
        detalle.suministroEgreso = sEgrso;


        console.log(detalle);
        this.suministroEgreso.push(detalle);
        this.dataSource.data = this.suministroEgreso;

        setTimeout(() => {
          this.limpiarElementos();
        }, 1000);



      }

    }


  }
  limpiarElementos(){
      this.depart.nativeElement.value = '';
      this.suminst.nativeElement.value = '';
      this.fechaSeleccionada = new Date();
      this.fechaSeleccionada.setHours(0);
      this.fechaSeleccionada.setMinutes(0);
      this.fechaSeleccionada.setSeconds(0);
      this.fechaSeleccionada.setMilliseconds(0);
      this.suministroSeleccionado = null;
      this.departamentoSeleccionado = null;

  }

}
