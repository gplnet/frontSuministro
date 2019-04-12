import { Component, OnInit } from '@angular/core';
import { Equipo } from 'src/app/_model/equipo';
import { FormGroup, FormControl } from '@angular/forms';
import { EquipoService } from 'src/app/_service/equipo.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

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

  constructor(private eqpS: EquipoService, private route: ActivatedRoute, private router: Router) {
    this.equipo = new Equipo();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'marca': new FormControl(''),
      'modelo': new FormControl(''),
      'estado': new FormControl('')

    });
  }

  ngOnInit() {
    this.route.params.subscribe( (x:Params) =>{
      this.id = x['id'];
      this.edicion =  x['id'] != null;
      this.initForm();

    });
  }

  private initForm(){
    if(this.edicion){
      this.eqpS.getEquipoPorId(this.id).subscribe(data => {
        let id = data.Eqp_Ide;
        let marca = data.Eqp_Mrc;
        let modelo = data.Eqp_Mdl;
        let estado = data.Eqp_Est;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'marca': new FormControl(marca),
          'modelo': new FormControl(modelo),
          'estado': new FormControl(estado)
        });
      });
    }
  }

  operar(){
    this.equipo.Eqp_Ide = this.form.value['id'];
    this.equipo.Eqp_Mrc = this.form.value['marca'];
    this.equipo.Eqp_Mdl = this.form.value['modelo'];
    this.equipo.Eqp_Est = this.form.value['estado'];

    if(this.equipo != null && this.equipo.Eqp_Ide > 0){
      //update
      this.eqpS.modificar(this.equipo).subscribe( data =>{
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

}
