import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
    `
    .image-container {
      position: relative; 
      display: inline-block; 
      left: 50%;
      transform: translate(-50%);
    }

    `
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
