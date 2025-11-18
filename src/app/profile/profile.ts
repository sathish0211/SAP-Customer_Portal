import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

  private http = inject(HttpClient);

  // Signals to store SAP data
  profileData = signal<any>(null);
  loading = signal(true);

  constructor() {
    this.fetchProfile();
  }

  fetchProfile() {
    const customerId = localStorage.getItem('customerId');  // from login

    if (!customerId) {
      alert('Customer ID not found. Please login again.');
      return;
    }

    this.http.post("http://localhost:3001/profile", { customerId })
      .subscribe({
        next: (res: any) => {
          this.profileData.set(res.profile);
          this.loading.set(false);
        },
        error: () => {
          alert("Unable to fetch profile from SAP");
          this.loading.set(false);
        }
      });
  }
}

export { ProfileComponent as Profile };
