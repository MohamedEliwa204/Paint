import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ShapesBar} from './components/shapes-bar/shapes-bar';

@Component({
  selector: 'app-root',
  imports: [ShapesBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Paint');
}
