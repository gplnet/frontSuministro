import { Component, OnInit } from '@angular/core';
import { Equipo } from 'src/app/_model/equipo';
import { FormGroup, FormControl } from '@angular/forms';
import { EquipoService } from 'src/app/_service/equipo.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Departamento } from '../../../_model/departamento';
import { DepartamentoService } from '../../../_service/departamento.service';

@Component({
  selector: 'app-equipo-edicion',
  templateUrl: './equipo-edicion.component.html',
  styleUrls: ['./equipo-edicion.component.css']
})
export class EquipoEdicionComponent implements OnInit {

  id: number;
  equipo: Equipo;
  form: FormGroup;
  edicion: boolean = false;
  departamentos : Departamento[] = [];
  departamentoSelected: Departamento;

  constructor(private eqpS: EquipoService, private route: ActivatedRoute, 
              private router: Router, private departServ: DepartamentoService) {
    this.equipo = new Equipo();

    this.form = new FormGroup({
      'eqp_ide': new FormControl(0),
      'eqp_mrc': new FormControl(''),
      'eqp_mdl': new FormControl(''),
      'eqp_ser': new FormControl(''),
      'eqp_est': new FormControl('')

    });
  }

  ngOnInit() {
    this.listarDepartamentos();
    this.route.params.subscribe( (x:Params) =>{
      this.id = x['id'];
      this.edicion =  x['id'] != null;
      this.initForm();

    });
  }

  private initForm(){
    if(this.edicion){
      this.eqpS.getEquipoPorId(this.id).subscribe(data => {
        let id = data.eqp_Ide;
        let marca = data.eqp_mrc;
        let modelo = data.eqp_mdl;
        let serie = data.eqp_ser;
        let estado = data.eqp_est;
        this.departamentoSelected = data.departamento;

        this.form = new FormGroup({
          'eqp_ide': new FormControl(id),
          'eqp_mrc': new FormControl(marca),
          'eqp_mdl': new FormControl(modelo),
          'eqp_ser': new FormControl(serie),
          'eqp_est': new FormControl(estado)
        });
      });
    }
  }
//eqp_est
  operar(){
    this.equipo.eqp_Ide = this.form.value['eqp_ide'];
    this.equipo.eqp_mrc = this.form.value['eqp_mrc'];
    this.equipo.eqp_mdl = this.form.value['eqp_mdl'];
    this.equipo.eqp_ser = this.form.value['eqp_ser'];
    this.equipo.eqp_est = this.form.value['eqp_est'];
    this.equipo.departamento = this.departamentoSelected;
    console.log(this.equipo);

    if(this.equipo != null && this.equipo.eqp_Ide > 0){
      //update
      this.eqpS.  modificar(this.equipo).subscribe( data =>{
        if(data === 1){
          //exito
          this.eqpS.getListarEquipo(0,100).subscribe( equipo => {
            this.eqpS.equipoCambio.next(equipo);
            this.eqpS.mensaje.next('Se modifico');
          });
        }else{
          //no se registro
          this.eqpS.mensaje.next('No se modifico');
        }

      });


    }else{
      //insert
      this.eqpS.registrar(this.equipo).subscribe( data =>{

        if(data === 1){
          //exito
          this.eqpS.getListarEquipo(0,100).subscribe( equipos => {
            this.eqpS.equipoCambio.next(equipos);
            this.eqpS.mensaje.next('Se registro');
          });
        }else{
          //no se registro
          this.eqpS.mensaje.next('No se registro');
        }
      });
    }
    this.router.navigate(['equipo']);

  }

  listarDepartamentos(){
    this.departServ.getListar().subscribe(
      (resp:any) => {
        console.log(resp);
        this.departamentos = resp;
      }
    );
  }

}
