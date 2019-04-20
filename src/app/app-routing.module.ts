import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { EquipoEdicionComponent } from './pages/equipo/equipo-edicion/equipo-edicion.component';
import { LoginComponent } from './login/login.component';
import { GuardService } from './_service/guard.service';

const routes: Routes = [
  {path:'equipo', component: EquipoComponent, children: [
    {path: 'nuevo', component: EquipoEdicionComponent},
    {path: 'edicion/:id', component: EquipoEdicionComponent}
  ], canActivate: [GuardService]
},
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
