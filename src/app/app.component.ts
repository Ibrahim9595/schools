import { Component,OnInit,ElementRef, AfterViewInit } from '@angular/core';
declare let jQuery: any;
declare let $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
      
       // jQuery.material.init();
    }
     
   lang = 'en'
  arrow = ['chevron_right', 'keyboard_arrow_down']
  sideNav = [
    {
      active: 0
    }
  ]

  openMenu(item) {
    item.active = (item.active + 1) % 2;
    //console.log(item.active)
  }

  submit(event) {
    console.log(event);
  }
}
