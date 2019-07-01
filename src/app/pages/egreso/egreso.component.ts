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
  @ViewChild('acept') acept: ElementRef;


  displayedColumns = ['id', 'descripcion', 'modelo', 'departamento','cantidad', 'acciones'];
  dataSource: MatTableDataSource<Egreso>;

  suministros:Suministro [] = [];
  departamentos:Departamento [] = [];
  suministroEgreso: Egreso [] = [];

  listaCantidades = [];
  listaSEgreso: SuministroEgreso[] = [];

  myControl: FormControl = new FormControl();
  myControlDepart: FormControl = new FormControl();


  mensaje: string;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  cantidad: number;
  valorActual: number;

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
  aceptar() {
    let verfica = {};
    let stado = false;

    for (let j=0; j<this.suministroEgreso.length; j++) {
      if(j===0){verfica = this.suministroEgreso[j];}
      console.log(verfica);
      let sumSelect = this.suministroEgreso[j];
      console.log(sumSelect);
      if(sumSelect['departamento'].dpr_Ide !== verfica['departamento'].dpr_Ide ){
        stado = true;
      }
    }
    console.log(stado);
    if (stado) {
      this.mensaje = `Existen suministros asignados a varios departamentos, revise datos`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 4000 });
    } else {
      console.log('loga');
      console.log(this.suministroEgreso);
      this.dataSource.data = null;
      for(let k = 0; k < this.suministroEgreso.length; k++ ) {
        this.suministroEgreso[k]['suministroEgreso'][k].seg_can = this.listaCantidades[k];
        console.log(this.suministroEgreso[k]['suministroEgreso'][k].seg_can);
        console.log(this.suministroEgreso[k]);
        this.sS.registrar(this.suministroEgreso[k]).subscribe(data => {
          console.log(data);
          if (data) {
            this.snackBar.open("Se registró", "Aviso", { duration: 2000 });
          } else {
            this.snackBar.open("Error al registrar", "Aviso", { duration: 2000 });
          }
        });
      }
      setTimeout(() => {
        this.limpiarElementos();
        this.suministroEgreso.length = 0;
      }, 2000);

    }

  }
  estadoBotonRegistrar(){
    return (this.suministroEgreso.length === 0 );
  }
  cambio(valor: number){
    this.listaCantidades.push(valor);
  }

  eliminar(row,i){
    console.log(row);
    console.log(i);
    this.suministroEgreso.splice(i, 1);
    this.dataSource.data = this.suministroEgreso;
  }

  agregar(){
    console.log(this. departamentoSeleccionado);
    console.log(this.suministroSeleccionado);
    console.log('1--->'+ this.cantidad);
    if ((this. departamentoSeleccionado === undefined && this.suministroSeleccionado === undefined) || (this. departamentoSeleccionado === null && this.suministroSeleccionado === null)){

      this.mensaje = `Debe seleccionar suminsitro y un departamento.`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });


    } else {
      if( this. suministroSeleccionado.sum_ide > 0  && this.departamentoSeleccionado.dpr_Ide > 0 ){
        let cont =0;
        for ( let i=0; i<this.suministroEgreso.length; i++ ){
          let sumEgrs = this.suministroEgreso[i];
          if(sumEgrs.suministroEgreso[i].suministro.sum_ide === this.suministroSeleccionado.sum_ide && sumEgrs.departamento.dpr_Ide === this.departamentoSeleccionado.dpr_Ide){
            cont++;
            break;
          }
        }
        if(cont > 0 ){
          this.mensaje = `El suministro y depatamento se encuentran en la lista`;
          this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });

        }else{
          let idV = 0;
          let detalle = new Egreso();
          let sEgrso = new SuministroEgreso();
          sEgrso.suministro = this.suministroSeleccionado;
          console.log('2--->'+ this.cantidad);
          sEgrso.seg_can = this.cantidad;
          sEgrso.seg_ide = idV;


          detalle.departamento  = this.departamentoSeleccionado;

          detalle.fecha = this.fechaSeleccionada;
          detalle.suministroEgreso.push(sEgrso);


          console.log(detalle);
          this.suministroEgreso.push(detalle);
          this.dataSource.data = this.suministroEgreso;

          setTimeout(() => {
            this.limpiarElementos();
          }, 1000);

        }
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
