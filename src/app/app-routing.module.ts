import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { EquipoEdicionComponent } from './pages/equipo/equipo-edicion/equipo-edicion.component';
import { LoginComponent } from './login/login.component';
import { GuardService } from './_service/guard.service';
import { PagesComponent } from './pages/pages.component';
import { Not403Component } from './pages/not403/not403.component';

const routes: Routes = [
  {path:'', component: PagesComponent, children: [
    {path:'equipo', component: EquipoComponent, children: [
      {path: 'nuevo', component: EquipoEdicionComponent},
      {path: 'edicion/:id', component: EquipoEdicionComponent},
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ], canActivate: [GuardService]
  },
  ]},
  { path: 'login', component: LoginComponent },
  { path: '**', component: Not403Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
