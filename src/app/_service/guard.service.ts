import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { TOKEN_NAME } from '../_shared/var.constant';
import { LoginService } from './login.services';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    // verifica si el token esta activo
    //redireccion a login
    let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));

    if (token != null) {
      let access_token = token.access_token;

      let rpta = this.loginService.estaLogeado();
      if (!rpta) {
        sessionStorage.clear();
        this.router.navigate(['login']);
        return false;
      } else {
        if (tokenNotExpired(TOKEN_NAME, access_token)) {
          return true;
        } else {
          sessionStorage.clear();
          this.router.navigate(['login']);
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
