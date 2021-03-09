import { Component, OnInit,AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Portal Gersalão';
  mediaSub: Subscription;
  media$ :Observable<MediaChange[]>;
  
  constructor(
              private cdRef:ChangeDetectorRef,
              private mediaObserver:MediaObserver,
              )
              {
                  

              }
  
  ngOnInit(){
      
  }

  

  ngAfterViewInit(){

  }

  ngOnDestroy(){
    
  }
}
