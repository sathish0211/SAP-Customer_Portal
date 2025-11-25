import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {

  private router = inject(Router);

  constructor() {

    // Disable browser's back/forward cached navigation
    window.addEventListener('popstate', () => {

      const isLoggedIn = !!localStorage.getItem('customerId');

      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }
}
