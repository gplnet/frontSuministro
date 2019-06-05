import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/_model/departamento';
import { FormGroup, FormControl } from '@angular/forms';
import { DepartamentoService } from 'src/app/_service/departamento.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-departamento-edicion',
  templateUrl: './departamento-edicion.component.html',
  styleUrls: ['./departamento-edicion.component.css']
})
export class DepartamentoEdicionComponent implements OnInit {

  id: number;
  departamento: Departamento;
  form: FormGroup;
  edicion: boolean = false;

  constructor(private dpt: DepartamentoService, private route: ActivatedRoute, private router: Router) {
    this.departamento = new Departamento();

    this.form = new FormGroup({
      'dpr_Ide': new FormControl(0),
      'dpr_Nom': new FormControl(''),
      'dpr_Res': new FormControl('')

    });
  }

  ngOnInit() {
    this.route.params.subscribe( (x:Params) =>{
      console.log(x);
      this.id = x['id'];
      this.edicion =  x['id'] != null;
      this.initForm();

    });
  }

  private initForm(){
    if(this.edicion){
      this.dpt.getDepartamentoPorId(this.id).subscribe(data => {
        //console.log(data);
        let id = data.dpr_Ide;
        let nombre = data.dpr_Nom;
        let responsable = data.dpr_Res;

        this.form = new FormGroup({
          'dpr_Ide': new FormControl(id),
          'dpr_Nom': new FormControl(nombre),
          'dpr_Res': new FormControl(responsable),
        });
      });
    }
  }

  operar(){
    this.departamento.dpr_ide = this.form.value['dpr_Ide'];
    this.departamento.dpr_nom = this.form.value['dpr_Nom'];
    this.departamento.dpr_res = this.form.value['dpr_Res'];
    console.log(this.departamento);

    if(this.departamento != null && this.departamento.dpr_ide > 0){
      //update
      this.dpt.modificar(this.departamento).subscribe( data =>{
        console.log(data);
        if(data === 1){
          //exito
          this.dpt.getListarDepartamento(0,100).subscribe( departamento => {
            this.dpt.departamentoCambio.next(departamento);
            this.dpt.mensaje.next('Se modifico');
          });
        }else{
          //no se registro
          this.dpt.mensaje.next('No se modifico');
        }

      });


    }else{
      //insert
      this.dpt.registrar(this.departamento).subscribe( data =>{

        if(data === 1){
          //exito
          this.dpt.getListarDepartamento(0,100).subscribe( departamento => {
            this.dpt.departamentoCambio.next(departamento);
            this.dpt.mensaje.next('Se registro');
          });
        }else{
          //no se registro
          this.dpt.mensaje.next('No se registro');
        }
      });
    }
    this.router.navigate(['departamento']);

  }


}

