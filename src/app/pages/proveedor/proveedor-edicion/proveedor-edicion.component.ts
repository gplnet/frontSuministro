import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Proveedor } from 'src/app/_model/proveedor';
import { ProveedorService } from 'src/app/_service/proveedor.service';

@Component({
  selector: 'app-proveedor-edicion',
  templateUrl: './proveedor-edicion.component.html',
  styleUrls: ['./proveedor-edicion.component.css']
})
export class ProveedorEdicionComponent implements OnInit {

  id: number;
  proveedor: Proveedor;
  form: FormGroup;
  edicion: boolean = false;

  constructor(private prvS: ProveedorService, private route: ActivatedRoute, private router: Router) {
    this.proveedor = new Proveedor();

    this.form = new FormGroup({
      'prv_ide': new FormControl(0),
      'prv_nom': new FormControl(''),
      'prv_cro': new FormControl(''),
      'prv_tlf': new FormControl('')

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
      this.prvS.getProveedorPorId(this.id).subscribe(data => {
        let id = data.prv_ide;
        let nombre = data.prv_nom;
        let correo = data.prv_cro;
        let telefono = data.prv_tlf;

        this.form = new FormGroup({
          'prv_ide': new FormControl(id),
          'prv_nom': new FormControl(nombre),
          'prv_cro': new FormControl(correo),
          'prv_tlf': new FormControl(telefono)
        });
      });
    }
  }
//eqp_est
  operar(){
    this.proveedor.prv_ide = this.form.value['prv_ide'];
    this.proveedor.prv_nom = this.form.value['prv_nom'];
    this.proveedor.prv_cro = this.form.value['prv_cro'];
    this.proveedor.prv_tlf = this.form.value['prv_tlf'];
    console.log(this.proveedor);

    if(this.proveedor != null && this.proveedor.prv_ide > 0){
      //update
      this.prvS.  modificar(this.proveedor).subscribe( data =>{
        if(data === 1){
          //exito
          this.prvS.getListarProveedor(0,100).subscribe( proveedor => {
            this.prvS.proveedorCambio.next(proveedor);
            this.prvS.mensaje.next('Se modifico');
          });
        }else{
          //no se registro
          this.prvS.mensaje.next('No se modifico');
        }

      });


    }else{
      //insert
      this.prvS.registrar(this.proveedor).subscribe( data =>{

        if(data === 1){
          //exito
          this.prvS.getListarProveedor(0,100).subscribe( proveedors => {
            this.prvS.proveedorCambio.next(proveedors);
            this.prvS.mensaje.next('Se registro');
          });
        }else{
          //no se registro
          this.prvS.mensaje.next('No se registro');
        }
      });
    }
    this.router.navigate(['proveedor']);

  }

}
