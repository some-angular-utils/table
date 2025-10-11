import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableModule } from '@some-angular-utils/table';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TableModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('table');
}
