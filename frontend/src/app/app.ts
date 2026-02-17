import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/layout/header/header";
import { Footer } from "./shared/layout/footer/footer";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    RouterOutlet,
    Header,
    Footer
  ]
})
export class App {
  protected readonly title = signal('frontend');
}
