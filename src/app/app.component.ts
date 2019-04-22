import { Component, OnInit } from '@angular/core';
import { AuthService } from './_service/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  title = 'frontApp';

  constructor(private auth: AuthService)
  {  }

  ngOnInit(){
    this.isLoggedIn$ = this.auth.isLoggedIn;
  }
}
