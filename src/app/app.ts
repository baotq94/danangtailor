import { Component, DOCUMENT, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BASE_PATH } from './core/site';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    // Keep <base href> in step with siteUrl in the prerendered HTML.
    inject(DOCUMENT).querySelector('base')?.setAttribute('href', BASE_PATH);
  }
}
