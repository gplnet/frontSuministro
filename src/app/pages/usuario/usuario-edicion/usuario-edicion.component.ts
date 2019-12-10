import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../_model/usuario';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UsuarioService } from '../../../_service/usuario.service';

@Component({
  selector: 'app-usuario-edicion',
  templateUrl: './usuario-edicion.component.html',
  styles: [
    `
    .example-container {
      display: flex;
      flex-direction: column;
    }
    
    .example-container > * {
      width: 100%;
    }
    

    `
  ]
})
export class UsuarioEdicionComponent implements OnInit {
  id: number;
  usuario: Usuario;
  form: FormGroup;
  edicion: boolean = false;
  hide = true;

  roles: any = [];
  rol: string = '';
  usuarios: Usuario [] = [];
  usuarioSelected: Usuario;
  idMax: number = 0;

  constructor( private route: ActivatedRoute,
               private usuarioService: UsuarioService,
               private router: Router) {
    this.usuario = new Usuario();
    

    this.form = new FormGroup({
      'idUsuario': new FormControl(0),
      'username': new FormControl('', [ Validators.required]),
      'password': new FormControl('',[ Validators.required, Validators.min(3) ]),
      'authorithy': new FormControl(''),
      'enabled': new  FormControl('')
    });

  }

  ngOnInit() {
    this.roles.push('ROLE_ADMIN', 'ROLE_USER');
    
    this.route.params.subscribe( (x:Params) =>{
      this.id = x['id'];
      this.edicion =  x['id'] != null;
      this.initForm();

    });
  }
  private initForm(){
    if(this.edicion){
      this.usuarioService.getUsuarioPorId(this.id).subscribe(data => {
        let id = data.idUsuario;
        let username = data.username;
        let password = data.password;
        this.rol = data.authorithy;
        let enabled = data.enabled;


        this.form = new FormGroup({
          'idUsuario': new FormControl(id),
          'username': new FormControl(username),
          'password': new FormControl(password),
          'authorithy': new FormControl(this.rol),
          'enabled': new  FormControl(enabled)
        });

      });
    }
  }
  obtenerIdMaxUsuario(){
    this.usuarioService.getMaxIdUsuario().subscribe(
      (data: any) => {
        console.log(data);
        this.idMax = data;
      }
    );
  }
  operar(){
    this.usuario.idUsuario  = this.form.value['idUsuario'];
    this.usuario.username  = this.form.value['username'];
    this.usuario.password  = this.form.value['password'];
    this.usuario.authorithy = this.rol;
    this.usuario.enabled  = true;

    console.log(this.usuario);
    if(this.usuario.authorithy !== ''){
      if(this.usuario !== null && this.usuario.idUsuario > 0){
        //actualizo
        this.usuarioService.modificar(this.usuario).subscribe( data => {
          if(data === 1){
            this.usuarioService.getListarUsuario(0,100).subscribe( usuario =>{
              this.usuarioService.usuarioCambio.next(usuario);
              this.usuarioService.mensaje.next('Se modifico');
            });
          }else{
            this.usuarioService.mensaje.next('No se logto modificar');
          }
        });

      }else {
        //creo un nuev registro
        this.obtenerIdMaxUsuario();
        this.usuario.idUsuario = this.idMax + 1;
        console.log('es nuevo');
        this.usuarioService.registrar(this.usuario).subscribe( (data: any) => {
          if(data.idUsuario > 0){
            this.usuarioService.getListarUsuario(0,100).subscribe( usuario =>{
              this.usuarioService.usuarioCambio.next(usuario);
              this.usuarioService.mensaje.next('Se registro un nuevo usuario: '+ data.username);
            });
          }else{
            this.usuarioService.mensaje.next('No se logro modificar');
          }
        });
      }
      this.router.navigate(['usuario']);

    }else{
      this.usuarioService.mensaje.next('Te falta un campo, pero tanquilo debe selecionar un rol');
    }

  }

}
