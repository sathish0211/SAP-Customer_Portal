import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {

  constructor(private router: Router) {

    // Prevent browser from going back to cached pages
    history.pushState(null, '', location.href);

    window.addEventListener('popstate', () => {
      const isLoggedIn = !!localStorage.getItem('customerId');

      if (isLoggedIn) {
        // 🔥 User is logged in → stay inside HOME, block logout
        history.pushState(null, '', location.href);
        this.router.navigate(['/home']);
      } else {
        // 🔥 User is NOT logged in → go to LOGIN
        this.router.navigate(['/login']);
      }
    });
  }
}
