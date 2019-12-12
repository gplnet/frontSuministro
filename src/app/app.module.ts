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
import { DatePipe } from '@angular/common';
import { SuministroComponent } from './pages/suministro/suministro.component';
import { SuministroEdicionComponent } from './pages/suministro/suministro-edicion/suministro-edicion.component';
import { IngresoComponent } from './pages/ingreso/ingreso.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { UsuarioEdicionComponent } from './pages/usuario/usuario-edicion/usuario-edicion.component';
import { DepartamentoService } from './_service/departamento.service';
import { ProveedorService } from './_service/proveedor.service';
import { SuministroEgresoService } from './_service/suministro-egreso.service';
import { SuministroService } from './_service/suministro.service';
import { UsuarioService } from './_service/usuario.service';
import { IngresoService } from './_service/ingreso.service';
import { HomeComponent } from './pages/home/home.component';






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
    SuministroComponent,
    SuministroEdicionComponent,
    IngresoComponent,
    UsuarioComponent,
    UsuarioEdicionComponent,
    HomeComponent,

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
  providers: [EquipoService, DepartamentoService,
              ProveedorService, SuministroEgresoService,
              UsuarioService, IngresoService,
              SuministroService, LoginService, GuardService,
              DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
