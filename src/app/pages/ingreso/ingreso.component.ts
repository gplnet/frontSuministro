import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Suministro } from '../../_model/suministro';
import { Proceso } from '../../_model/proceso';
import { IngresoService } from '../../_service/ingreso.service';
import { Ingreso } from '../../_model/ingreso';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { SuministroIngreso } from '../../_model/suministroIngreso';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styles: [
    `
    table {
      width: 100%;
      border-collapse: collapse;
    }
    /* Zebra striping */
    tr:nth-of-type(odd) {
      background: #eeeeee;
    }
    th {
      background: #333;
      color: white;
      font-weight: bold;
    }
    td, th {
      padding: 6px;
      border: 1px solid #ccc;
      text-align: center;
    }
    .align-right{
      display: flex !important;
      padding: 21px 0 !important;
      justify-content: center !important;
    }

    `
  ]
})
export class IngresoComponent implements OnInit {

  @ViewChild('suminst') suminst: ElementRef;
  @ViewChild('porceso') porceso: ElementRef;


  displayedColumns = ['id', 'descripcion', 'modelo', 'proceso','cantidad', 'acciones'];
  dataSource: MatTableDataSource<Ingreso>;

  suministros: Suministro [] = [];
  procesos: Proceso [] = [];
  suministrosIngresos: Ingreso [] = [];

  suministroIngrsoEnLista: Ingreso [] = [];

  listaCantidades = [];
  stockSumSelected =  [];
  respaldoListCantidades = [];


  filteredOptions: Observable<any[]>;
  filteredOptionsProceso: Observable<any[]>;

  myControl: FormControl = new FormControl();
  myControlProceso: FormControl = new FormControl();

  suministroSeleccionado: Suministro;
  procesoSeleccionado: Proceso;
  
  mensaje: string;
  fechaSeleccionada: Date = new Date();
  cantidad: number;

  constructor(
              private sIngreso: IngresoService,
              public snackBar: MatSnackBar,
              private datePipe: DatePipe,
              ) {
    this.dataSource = new MatTableDataSource<Ingreso>();
    }

  ngOnInit() {

    this.listarProcesos();
    this.listarSuministros();

    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);

    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(null), map(val => this.filter(val)) );
    this.filteredOptionsProceso = this.myControlProceso.valueChanges.pipe(startWith(null), map(val => this.filterProceso(val)) );
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
  filterProceso(val: any) {
    console.log(val);
    if (val != null && val.pcs_ide > 0) {
      return this.procesos.filter(option =>
        option.pcs_cod.toLowerCase().includes(val.pcs_cod.toLowerCase()) || option.pcs_cod.toLowerCase().includes(val.pcs_cod.toLowerCase()) );
    } else {
      console.log(val);
      return this.procesos.filter(option =>
        option.pcs_cod.toLowerCase().includes(val.toLowerCase()) || option.pcs_cod.toLowerCase().includes(val.toLowerCase()));
    }
  }


  seleccionarsuministro(e){
    this.suministroSeleccionado = e.option.value;
    console.log(this.suministroSeleccionado);
  }
  seleccionarProceso(e){
    console.log(e);
    this.procesoSeleccionado = e.option.value;
    console.log(this.procesoSeleccionado);
  }

  displayFn(val: Suministro) {
    return val ? `${val.sum_cod} ${val.sum_col}` : val;
  }

  displayFnProceso(val: Proceso){
    return val ? `${val.pcs_cod} ` : val;
  }

  listarProcesos(){
    this.sIngreso.getListarProcesos().subscribe( data =>{
      this.procesos = data;
    });
  }
  
  listarSuministros(){
    this.sIngreso.getListar().subscribe( data => {
      this.suministros = data;
    });
  }
  
  agregar(){
    console.log(this.suministroSeleccionado);
    console.log(this.procesoSeleccionado);
    if ((this. procesoSeleccionado === undefined && this.suministroSeleccionado === undefined) 
        || (this. procesoSeleccionado === null && this.suministroSeleccionado === null)
        || this.procesoSeleccionado === undefined || this.suministroSeleccionado === undefined
        ) {

      this.mensaje = `Tienes un error pero tranquilo, te falta seleccionar suministro o un proceso o ambos.`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 3000 });
    }else{
      if (this.suministroSeleccionado.sum_ide > 0 && this.procesoSeleccionado.pcs_ide > 0){
        let cont = 0;
        for(let i = 0; i < this.suministrosIngresos.length; i++) {
          let sIng = this.suministrosIngresos[i];
          if(sIng.suministroIngreso[0].suministro.sum_ide === this.suministroSeleccionado.sum_ide &&
             sIng.proceso.pcs_ide === this.procesoSeleccionado.pcs_ide){
            cont++;
            break;
          }
        }
        if(cont > 0){
          this.mensaje = `El suministro y proceso ya se encuentran en la lista`;
          this.snackBar.open(this.mensaje, "Aviso", { duration: 3000 });
        }else{
          let idV = 0;
          let detalle = new Ingreso();
          const sumIng = new SuministroIngreso();
          sumIng.suministro = this.suministroSeleccionado;
          sumIng.sen_can = this.cantidad;
          sumIng.sen_ide = idV;

          detalle.proceso = this.procesoSeleccionado;
          let fechaFormateada = this.datePipe.transform(this.fechaSeleccionada, "dd/MM/yyyy");
          detalle.ing_fec = fechaFormateada;
          detalle.suministroIngreso.push(sumIng);

          this.suministrosIngresos.push(detalle);
          console.log(this.suministrosIngresos[0].suministroIngreso[0].suministro.sum_col);
          this.listaCantidades.length = 0;
          for (let j = 0; j < this.suministrosIngresos.length; j++) {
            this.listaCantidades.push({proceso: this.suministrosIngresos[j]['proceso'].pcs_ide,
                                       suministro: this.suministrosIngresos[j]['suministroIngreso'][0]['suministro'].sum_ide,
                                       cantidad:0 });
          }
          this.dataSource.data = this.suministrosIngresos;

          this.filtrarProceso();
          this.obtenerStockActualSum();
          this.limpiarElementos();
          this.reasignarValores();

        }
      }
    }

  }

  reasignarValores(){
    if(this.listaCantidades.length > 0 && this.respaldoListCantidades.length > 0){
      for (let i=0; i < this.listaCantidades.length; i++) {
        for(let j=0; j < this.respaldoListCantidades.length; j++){
          if(this.listaCantidades[i].cantidad === 0){
            if(  this.listaCantidades[i].departamento ===
                  this.respaldoListCantidades[j].departamento &&
                  this.listaCantidades[i].suministro === this.respaldoListCantidades[j].suministro) {
              console.log('listaCantidades',this.listaCantidades[i].cantidad );
              console.log('respaldoListCantidades',this.respaldoListCantidades[j].cantidad );
              this.listaCantidades[i].cantidad = this.respaldoListCantidades[j].cantidad;
            }
          }
        }
      }
    }
  }

  filtrarProceso(){
    this.procesos.length = 0;
    let  id = this.procesoSeleccionado.pcs_ide;
    this.sIngreso.getProcesoId(id).subscribe( data => {
      this.procesos.push(data);
    });
  }

  obtenerStockActualSum(){
    let idSum = this.suministroSeleccionado.sum_ide;
    this.sIngreso.getSuministroIngresoPorId(idSum).subscribe(data =>{
      this.stockSumSelected.push(data);
    });
  }

  limpiarElementos(){
    this.porceso.nativeElement.value = '';
    this.suminst.nativeElement.value = '';
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.suministroSeleccionado = null;
    this.procesoSeleccionado = null;
  }
  cambio(event, row){
    console.log(row);
    let stadoAct = false;
    for(let h =0; h<this.stockSumSelected.length;h++){
       console.log(this.stockSumSelected[h]);
       if( this.stockSumSelected[h]['sum_ide']  === row['suministroIngreso'][0].suministro.sum_ide && this.stockSumSelected[h]['sum_cnt']< event.target.value ){
        stadoAct = true;
      }
    }
    //compruebo que la cantidad no vaya ser superior al stock actual
    if(stadoAct){
      let valor = event.target.value;
      event.target.value = 0;
      this.snackBar.open("El valor ingresado " +valor+" excede del Stock disponible", "Aviso", { duration: 4000 });

    }else{
      //Busco en arreglo y reasigno valor
      for(let i=0; i < this.listaCantidades.length; i++) {
        if ( this.listaCantidades[i]['proceso'] ===  row.proceso.pcs_ide &&  this.listaCantidades[i]['suministro'] ===  row.suministroIngreso[0].suministro['sum_ide'] ) {
          this.listaCantidades[i]['cantidad'] = event.target.value;
        }
      }
      this.respaldoListCantidades = [...this.listaCantidades];
      console.log(this.respaldoListCantidades);
      console.log(this.listaCantidades);

    }

  }
  eliminar(row,i){
    this.suministrosIngresos.splice(i,1);
    this.listaCantidades.splice(i,1);
    this.dataSource.data = this.suministrosIngresos;
  }
  estadoBotonRegistrar(){
    return (this.suministrosIngresos.length > 0 ? false : true );
  }
  descargarReporte(id){
    console.log(id);
    this.sIngreso.generarReporte(id).subscribe(
      data => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('style', 'display: none');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'ingreso.pdf';
        a.click();
        return url;
      }
    );
  }

  aceptar(){
    console.log('object');
    let stado: boolean = false;
    for (let k = 0; k < this.suministrosIngresos.length; k++) {
      stado = (parseFloat(this.listaCantidades[k]['cantidad'])*1) === 0 ? true : false;
      this.suministrosIngresos[k]['suministroIngreso'][0].sen_can = (parseFloat(this.listaCantidades[k]['cantidad'])*1);
      
    }
    //Cambio para ingresar un en solo suministro inggreso
    for (let k = 0; k < this.suministrosIngresos.length; k++) {      
      if(k === 0){
        this.suministroIngrsoEnLista.length = 0;
        this.suministroIngrsoEnLista.push(this.suministrosIngresos[k]);
      }else{
        this.suministroIngrsoEnLista[0]['suministroIngreso'].push(this.suministrosIngresos[k]['suministroIngreso'][0]);
      }
      console.log(this.suministroIngrsoEnLista);
    }
    if(stado){
      this.mensaje = `Existen suministros con cantidades en cero, revise datos`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 4000 });
    }else{
      console.log('object2');
      console.log(this.suministroIngrsoEnLista[0]);
      this.sIngreso.registrar(this.suministroIngrsoEnLista[0]).subscribe((data:any) =>{
        console.log(data);
        if(data){
          this.descargarReporte(''+data.ing_ide);
          this.snackBar.open("Se registró correctamente", "Aviso", { duration: 2000 });
          this.limpiarElementos();
          this.listarProcesos();
          this.listarSuministros();
          this.suministrosIngresos.length = 0;
        }else{
          this.snackBar.open("Error al registrar", "Aviso", { duration: 2000 });
        }
      });

    }
  }
}
