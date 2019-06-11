import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EquipoComponent } from './pages/equipo/equipo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { EquipoService } from './_service/equipo.service';
import { HttpClientModule } from '@angular/common/http';
import { EquipoEdicionComponent } from './pages/equipo/equipo-edicion/equipo-edicion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LoginService } from './_service/login.services';
import { GuardService } from './_service/guard.service';
import { Not403Component } from './pages/not403/not403.component';
import { PagesComponent } from './pages/pages.component';
import { SuministroEgresoComponent } from './pages/suministro-egreso/suministro-egreso.component';
import { EgresoComponent } from './pages/egreso/egreso.component';
import { DepartamentoComponent } from './pages/departamento/departamento.component';
import { DepartamentoEdicionComponent } from './pages/departamento/departamento-edicion/departamento-edicion.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorEdicionComponent } from './pages/proveedor/proveedor-edicion/proveedor-edicion.component';






@NgModule({
  declarations: [
    AppComponent,
    EquipoComponent,
    EquipoEdicionComponent,
    LoginComponent,
    Not403Component,
    PagesComponent,
    SuministroEgresoComponent,
    EgresoComponent,
    DepartamentoComponent,
    DepartamentoEdicionComponent,
    ProveedorComponent,
    ProveedorEdicionComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [EquipoService, LoginService, GuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
