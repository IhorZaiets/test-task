import { Component } from '@angular/core';
import { fromEvent, interval } from 'rxjs'; 
import { map, buffer, debounceTime, filter, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  startTime:any;
  currentTime:any;
  offset = 0;

  timerActive = false;

  timer = 0;
  timerId:any;

  logs : string[] = [];

  
  counter() {
    this.currentTime = new Date().getTime();
    this.timer = this.currentTime - this.startTime + this.offset;
    this.timerId = setTimeout(this.counter.bind(this), 100);
  }

  getTimeString() {
    let timeString = new Date(this.timer);

    let minutes = timeString.getMinutes();
    let seconds = timeString.getSeconds();
    let milliseconds = timeString.getMilliseconds();

    return `${minutes}:${seconds}.${milliseconds}`;
  }


  onStart() {
    if (this.timerActive) return;
    this.timerActive = true;
    
    this.startTime = new Date().getTime();
    this.counter();
  }
  
  onStop() {
    if (!this.timerActive) return;
    this.timerActive = false;
    this.offset = 0;
    this.timer = 0;
    this.offset = 0; 
    clearTimeout(this.timerId);    
  }

  onPause() {
    if (!this.timerActive) return;
    this.timerActive = false;
    
    this.logs.push(this.getTimeString());
    
    this.offset = this.timer;
    clearTimeout(this.timerId);
  }
  
  click$ = fromEvent(document, 'click')
  doubleClick$ = this.click$.pipe(
    buffer(
      this.click$.pipe(debounceTime(500))
    ),
    map(list => {
      return list.length;
    }),
    filter(x => x === 2),
  )

  onCustomPause() {
    this.doubleClick$.subscribe(() => this.onPause())
  }

  onReset() {
    if (this.timer == 0) return;
    
    if (this.timerActive) this.logs.push(this.getTimeString());

    this.timer = 0;
    this.offset = 0; 
    clearTimeout(this.timerId);

    if(!this.timerActive) return;

    this.startTime = new Date().getTime();
    this.counter();
  }
  
}