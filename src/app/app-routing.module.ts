import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { EquipoEdicionComponent } from './pages/equipo/equipo-edicion/equipo-edicion.component';

const routes: Routes = [
  {path:'equipo', component: EquipoComponent, children: [
    {path: 'nuevo', component: EquipoEdicionComponent},
    {path: 'edicion/:id', component: EquipoEdicionComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
