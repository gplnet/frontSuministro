import {DepartamentoService} from '../../_service/departamento.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SuministroEgresoService } from 'src/app/_service/suministro-egreso.service';
import { Suministro } from 'src/app/_model/suministro';

import { Departamento } from 'src/app/_model/departamento';
import { SuministroEgreso } from 'src/app/_model/suministroEgreso';
import { MatSnackBar, MatInput } from '@angular/material';
import { Egreso } from 'src/app/_model/egreso';
import { map, startWith, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { standardizeConfig } from '@angular/router/src/config';

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

  suministroEgresoEnLista: Egreso [] = [];

  listaCantidades = [];
  respaldoListCantidades = [];
  stockSumSelected =  [];
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
  isLoading: boolean;



  constructor(private sS: SuministroEgresoService,
              private sD: DepartamentoService,
              private datePipe: DatePipe,
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
    console.log(val);
    if (val != null && val.dpr_Ide > 0) {
      return this.departamentos.filter(option =>
        option.dpr_Nom.toLowerCase().includes(val.dpr_Nom.toLowerCase()) || option.dpr_Res.toLowerCase().includes(val.dpr_Res.toLowerCase()) );
    } else {
      console.log(val);
      return this.departamentos.filter(option =>
        option.dpr_Nom.toLowerCase().includes(val.toLowerCase()) || option.dpr_Res.toLowerCase().includes(val.toLowerCase()));
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
    console.log(e);
    this.departamentoSeleccionado = e.option.value;
    console.log(this.departamentoSeleccionado);
  }

  listarSuministrosEgresos(){
    this.sS.getListar().subscribe( data => {
      console.log(data);
      this.suministros = data;

    });
  }

  listarDepartamento(){
    this.sD.getListar().subscribe(data =>{
      console.log(data);
      this.departamentos = data;

    });

  }

  filtrarDepart(){
    this.departamentos.length = 0;
    let idD = this.departamentoSeleccionado.dpr_Ide;
    this.sD.getDepartamentoPorId(idD).subscribe(data => {
      console.log(data);
      this.departamentos.push(data);
    });

  }

  obtenerStockActualSum(){
    let idSum = this.suministroSeleccionado.sum_ide;
    this.sS.getSuministroEgresoPorId(idSum).subscribe(data =>{
      this.stockSumSelected.push(data);
      console.log(data);
    });
  }
  aceptar() {
    let verfica = {};
    let cont = 0;
    let stado = false;


    /* for (let j=0; j<this.suministroEgreso.length; j++) {
      if(j===0){verfica = this.suministroEgreso[j];}
      console.log(verfica);
      let sumSelect = this.suministroEgreso[j];
      console.log(sumSelect);
      if(sumSelect['departamento'].dpr_Ide !== verfica['departamento'].dpr_ide ){
        stado = true;
      }
    } */
    console.log(stado);
    if (stado) {
      this.mensaje = `Existen suministros asignados a varios departamentos, revise datos`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 4000 });
    } else {
      console.log('loga');
      console.log(this.suministroEgreso);
      console.log(this.listaCantidades);
      this.dataSource.data = null;
      for(let k = 0; k < this.suministroEgreso.length; k++ ) {
        this.suministroEgreso[k]['suministroEgreso'][0].seg_can = (parseFloat(this.listaCantidades[k]['cantidad'])*1);
        console.log(this.suministroEgreso[k]['suministroEgreso'][0].seg_can);
        console.log(this.suministroEgreso[k]);
        console.log(this.suministroEgreso);
       /*  */
      }
      //registro los valores en BD

      for (let k = 0; k < this.suministroEgreso.length; k++) {
        console.log(this.suministroEgreso[k]);
        if(k === 0){
          this.suministroEgresoEnLista.length = 0;
          this.suministroEgresoEnLista.push(this.suministroEgreso[k]);
        }else{
          this.suministroEgresoEnLista[0]['suministroEgreso'].push(this.suministroEgreso[k]['suministroEgreso'][0]);
        }
        console.log(this.suministroEgresoEnLista);
      }

      this.sS.registrar(this.suministroEgresoEnLista[0]).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.descargarReporte(''+data.egr_Ide);
          this.snackBar.open("Se registró", "Aviso", { duration: 2000 });
        } else {
          this.snackBar.open("Error al registrar", "Aviso", { duration: 2000 });
        }
      });
      setTimeout(() => {
        this.limpiarElementos();
        this.listarDepartamento();
        this.suministroEgreso.length = 0;
      }, 2000);

    }

  }

  descargarReporte(id){
    console.log(id);
    this.sS.generarReporte(id).subscribe(
      data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display: none');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'egreso.pdf';
        a.click();
        return url;
      }
    );

  }
  estadoBotonRegistrar(){
    return (this.suministroEgreso.length > 0 ? false : true );
  }

  cambio(event, row){
      let stadoAct = false;
      console.log('lola',row['suministroEgreso'][0].suministro.sum_ide);
      for(let h =0; h<this.stockSumSelected.length;h++){
        if( this.stockSumSelected[h]['sum_ide']  === row['suministroEgreso'][0].suministro.sum_ide && this.stockSumSelected[h]['sum_cnt']< event.target.value ){
          stadoAct = true;
        }
      }
      //veriico que la cantidad no vaya ser superior al stock actual
      if(stadoAct){
        let valor = event.target.value;
        event.target.value = 0;
        this.snackBar.open("El valor ingresado " +valor+" excede del Stock disponible", "Aviso", { duration: 4000 });

      }else{
        //Busco en arreglo y reasigno valor
        console.log(row);

        for(let i=0; i < this.listaCantidades.length; i++) {
          if ( this.listaCantidades[i]['departamento'] ===  row.departamento.dpr_Ide &&  this.listaCantidades[i]['suministro'] ===  row.suministroEgreso[0].suministro['sum_ide'] ) {
            this.listaCantidades[i]['cantidad'] = event.target.value;
          }
        }
      console.log(this.listaCantidades);
      //this.respaldoListCantidades.length = 0;
      // tslint:disable-next-line: align
      this.respaldoListCantidades = [...this.listaCantidades];
      console.log(this.respaldoListCantidades);
      //this.listaCantidades.length = 0;
      //this.listaCantidades.push(event.target.value);

    }

  }

  existeValor(id){
    let stado: boolean = false;
    for(let i=0; i < this.listaCantidades.length; i++) {
      if ( this.listaCantidades[i]['target'] === id) {
        stado = true;
      }
    }
    return stado;
  }

  eliminar(row,i){
    console.log(row);
    console.log(i);
    this.suministroEgreso.splice(i, 1);
    this.listaCantidades.splice(i, 1);
    this.dataSource.data = this.suministroEgreso;
    console.log(this.listaCantidades);
  }

  agregar(){
    console.log(this. departamentoSeleccionado);
    console.log(this.suministroSeleccionado);
    console.log('1--->'+ this.cantidad);
    //this.suministroEgreso = null;
    if ((this. departamentoSeleccionado === undefined && this.suministroSeleccionado === undefined) || (this. departamentoSeleccionado === null && this.suministroSeleccionado === null)){

      this.mensaje = `Debe seleccionar suminsitro y un departamento.`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });


    } else {
      if( this. suministroSeleccionado.sum_ide > 0  && this.departamentoSeleccionado.dpr_Ide > 0 ){
        let cont =0;
        for ( let i=0; i<this.suministroEgreso.length; i++ ){
          let sumEgrs = this.suministroEgreso[i];
          console.log(sumEgrs);
          if(sumEgrs.suministroEgreso[0].suministro.sum_ide === this.suministroSeleccionado.sum_ide && sumEgrs.departamento.dpr_Ide === this.departamentoSeleccionado.dpr_Ide){
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
          const sEgrso = new SuministroEgreso();
          sEgrso.suministro = this.suministroSeleccionado;
          console.log('2--->'+ this.cantidad);
          sEgrso.seg_can = this.cantidad;
          sEgrso.seg_ide = idV;


          detalle.departamento  = this.departamentoSeleccionado;
          console.log('fecha', this.datePipe.transform(this.fechaSeleccionada, "dd/MM/yyyy"));
          let fechaformateada = this.datePipe.transform(this.fechaSeleccionada, "dd/MM/yyyy");
          detalle.egr_fec = fechaformateada;
          detalle.suministroEgreso.push(sEgrso);




          console.log(detalle);
          this.suministroEgreso.push(detalle);
          console.log(this.suministroEgreso);


          console.log(this.respaldoListCantidades);
          this.listaCantidades.length = 0;
          for(let  j=0; j< this.suministroEgreso.length; j++){
            this.listaCantidades.push({departamento: this.suministroEgreso[j]['departamento'].dpr_Ide, suministro: this.suministroEgreso[j]['suministroEgreso'][0]['suministro'].sum_ide,cantidad:0});
          }
          console.log(this.listaCantidades);
          this.dataSource.data = this.suministroEgreso;

          setTimeout(() => {
            this.filtrarDepart();
            this.obtenerStockActualSum();
            this.limpiarElementos();
            this.reasignarValores();
          }, 1000);
          console.log(this.listaCantidades);

        }
      }

    }


  }
  reasignarValores(){
    //let checkeo = false;
    if(this.listaCantidades.length > 0 && this.respaldoListCantidades.length > 0){
      for (let i=0; i < this.listaCantidades.length; i++) {
        for(let j=0; j < this.respaldoListCantidades.length; j++){
          if(this.listaCantidades[i].cantidad === 0){
            if(  this.listaCantidades[i].departamento === this.respaldoListCantidades[j].departamento &&  this.listaCantidades[i].suministro === this.respaldoListCantidades[j].suministro) {
              console.log('listaCantidades',this.listaCantidades[i].cantidad );
              console.log('respaldoListCantidades',this.respaldoListCantidades[j].cantidad );
              this.listaCantidades[i].cantidad = this.respaldoListCantidades[j].cantidad;
            }
            //checkeo = true;
           // break;
          }
        }
        //if(checkeo){break;}
      }
    }
  }


  limpiarElementos() {
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
