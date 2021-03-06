import { Component, OnInit } from '@angular/core';
import * as decode from 'jwt-decode';
import { TOKEN_NAME } from 'src/app/_shared/var.constant';

@Component({
  selector: 'app-not403',
  templateUrl: './not403.component.html',
  styleUrls: ['./not403.component.css']
})
export class Not403Component implements OnInit {
  usuario: string;
  constructor() { }

  ngOnInit() {
    let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    const decodedToken = decode(token.access_token);
    this.usuario = decodedToken.user_name;
  }

}
