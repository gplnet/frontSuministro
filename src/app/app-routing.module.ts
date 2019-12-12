import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { EquipoEdicionComponent } from './pages/equipo/equipo-edicion/equipo-edicion.component';
import { LoginComponent } from './login/login.component';
import { GuardService } from './_service/guard.service';
import { PagesComponent } from './pages/pages.component';
import { Not403Component } from './pages/not403/not403.component';
import { EgresoComponent } from './pages/egreso/egreso.component';
import { DepartamentoComponent } from './pages/departamento/departamento.component';
import { DepartamentoEdicionComponent } from './pages/departamento/departamento-edicion/departamento-edicion.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorEdicionComponent } from './pages/proveedor/proveedor-edicion/proveedor-edicion.component';
import { SuministroComponent } from './pages/suministro/suministro.component';
import { SuministroEdicionComponent } from './pages/suministro/suministro-edicion/suministro-edicion.component';
import { IngresoComponent } from './pages/ingreso/ingreso.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { UsuarioEdicionComponent } from './pages/usuario/usuario-edicion/usuario-edicion.component';
import { HomeComponent } from './pages/home/home.component';
const routes: Routes = [
  
  { path: 'not-403', component: Not403Component },

  {path: 'equipo', component: EquipoComponent, children: [
    {path: 'nuevo', component: EquipoEdicionComponent},
    {path: 'edicion/:id', component: EquipoEdicionComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' }
  ], canActivate: [GuardService]},

  {path: 'suministro', component: SuministroComponent, children: [
    {path: 'nuevo', component: SuministroEdicionComponent},
    {path: 'edicion/:id', component: SuministroEdicionComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' }
  ], canActivate: [GuardService]},

  {path: 'departamento', component: DepartamentoComponent, children:[
    {path: 'nuevo', component: DepartamentoEdicionComponent},
    {path: 'edicion/:id', component: DepartamentoEdicionComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
  ], canActivate:[GuardService]},

  {path: 'proveedor', component: ProveedorComponent, children: [
    {path: 'nuevo', component: ProveedorEdicionComponent},
    {path: 'edicion/:id', component: ProveedorEdicionComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
  ], canActivate: [GuardService]},

  {path: 'usuario', component: UsuarioComponent, children: [
    {path: 'nuevo', component: UsuarioEdicionComponent},
    {path: 'edicion/:id', component: UsuarioEdicionComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
  ], canActivate: [GuardService]},


  { path: 'home', component: HomeComponent, canActivate: [GuardService]},
  { path: 'egreso', component: EgresoComponent, canActivate: [GuardService]},
  { path: 'ingreso', component: IngresoComponent, canActivate: [GuardService]},

  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
