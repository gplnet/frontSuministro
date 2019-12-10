import { Component, OnInit } from '@angular/core';
import { Suministro } from 'src/app/_model/suministro';
import { FormGroup, FormControl } from '@angular/forms';
import { SuministroService } from 'src/app/_service/suministro.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Equipo } from 'src/app/_model/equipo';
import { EquipoService } from 'src/app/_service/equipo.service';

@Component({
  selector: 'app-suministro-edicion',
  templateUrl: './suministro-edicion.component.html',
  styleUrls: ['./suministro-edicion.component.css']
})
export class SuministroEdicionComponent implements OnInit {

  id: number;
  suministro: Suministro;
  equipos : Equipo[] =[];
  form: FormGroup;
  edicion: boolean = false;
  idEquipoSeleccionado: Equipo;

  constructor(private sum: SuministroService, private eqp: EquipoService, private route: ActivatedRoute, private router: Router) { 
    this.suministro = new Suministro();
    //this.equipo = new Equipo();

    this.form = new FormGroup({
      'sum_ide': new FormControl(0),
      'sum_cnt': new FormControl(''),
      'sum_cod': new FormControl(''),
      'sum_col': new FormControl(''),
      'sum_mdl': new FormControl(''),
      'sum_vol': new FormControl(''),
      'eqp_ide': new FormControl('')

    });
  }

  ngOnInit() {
    this.listarEquipo();
    this.route.params.subscribe( (x:Params) =>{
      this.id = x['id'];
      this.edicion =  x['id'] != null;
      this.initForm();
    });

  }

  private initForm(){
    if(this.edicion){
      this.sum.getSuministroPorId(this.id).subscribe(data => {
        console.log(data);
        let id = data.sum_ide;
        let cantidad = data.sum_cnt;
        let codigo = data.sum_cod;
        let color = data.sum_col;
        let modelo = data.sum_mdl;
        let volumen = data.sum_vol;
        this.idEquipoSeleccionado = data.equipo;

        this.form = new FormGroup({
          'sum_ide': new FormControl(id),
          'sum_cnt': new FormControl(cantidad),
          'sum_cod': new FormControl(codigo),
          'sum_col': new FormControl(color),
          'sum_mdl': new FormControl(modelo),
          'sum_vol': new FormControl(volumen)
          
        });
      });
    }
  }

  operar(){
    this.suministro.sum_ide = this.form.value['sum_ide'];
    this.suministro.sum_cnt = this.form.value['sum_cnt'];
    this.suministro.sum_cod = this.form.value['sum_cod'];
    this.suministro.sum_col = this.form.value['sum_col'];
    this.suministro.sum_mdl = this.form.value['sum_mdl'];
    this.suministro.sum_vol = this.form.value['sum_vol'];
    this.suministro.equipo = this.idEquipoSeleccionado;
    console.log('estoy en el operar');
    console.log(this.idEquipoSeleccionado);
    console.log(this.suministro);

    if(this.suministro != null && this.suministro.sum_ide > 0){
      //update
      this.sum.  modificar(this.suministro).subscribe( data =>{
        if(data === 1){
          //exito
          this.sum.getListarSuministro(0,100).subscribe( suministro => {
            this.sum.suministroCambio.next(suministro);
            this.sum.mensaje.next('Se modifico');
          });
        }else{
          //no se registro
          this.sum.mensaje.next('No se modifico');
        }

      });


    }else{
      //insert
      this.sum.registrar(this.suministro).subscribe( data =>{

        if(data === 1){
          //exito
          this.sum.getListarSuministro(0,100).subscribe( suministros => {
            this.sum.suministroCambio.next(suministros);
            this.sum.mensaje.next('Se registro');
          });
        }else{
          //no se registro
          this.sum.mensaje.next('No se registro');
        }
      });
    }
    this.router.navigate(['suministro']);

  }

  listarEquipo(){
    this.eqp.getListar().subscribe(data =>{
      console.log(data);
      this.equipos = data;

    });

  }

}
