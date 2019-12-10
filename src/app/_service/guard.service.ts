import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { TOKEN_NAME } from '../_shared/var.constant';
import { LoginService } from './login.services';
import { tokenNotExpired } from 'angular2-jwt';
import * as decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    // verifica si el token esta activo
    //redireccion a login
    let rpta = this.loginService.estaLogeado();
    if (!rpta) {
        sessionStorage.clear();
        this.router.navigate(['login']);
        return false;
    } else {
        let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
        if (tokenNotExpired(TOKEN_NAME, token.access_token)) {
            const decodedToken = decode(token.access_token);
            console.log(decodedToken);
            let rol = decodedToken.authorities[0];

            let url = state.url;
            console.log(rol);
            console.log(url);

            switch (rol) {
                case 'ROLE_ADMIN': {
                    if (url === '/equipo' || url === '/egreso'|| url === '/departamento' || url === '/proveedor' || url === '/suministro') {
                        return true;
                    } else {
                        this.router.navigate(['not-403']);
                        return false;
                    }
                }
                case 'ROLE_USER': {
                    if (url === '/equipo' ) {
                        return true;
                    } else {
                        this.router.navigate(['not-403']);
                        return false;
                    }
                }
                default: {
                    this.router.navigate(['not-403']);
                    return false;
                }
            }
        } else {
            sessionStorage.clear();
            this.router.navigate(['login']);
            return false;
        }
    }
  }
}
