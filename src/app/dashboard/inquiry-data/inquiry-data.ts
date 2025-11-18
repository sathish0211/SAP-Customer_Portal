import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inquiry-data',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './inquiry-data.html',
  styleUrls: ['./inquiry-data.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InquiryDataComponent {

  private http = inject(HttpClient);
  private location = inject(Location);

  inquiries = signal<any[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.fetchInquiryData();
  }

  fetchInquiryData() {
    const customerId = localStorage.getItem('customerId');

    if (!customerId) {
      this.error.set('Customer ID missing. Please login again.');
      this.loading.set(false);
      return;
    }

    this.http.post<any>('http://localhost:3001/inquiry-data', { customerId })
      .subscribe({
        next: (res) => {
          if (res.status === 'SUCCESS') {
            this.inquiries.set(res.inquiries);
          } else {
            this.error.set('Unable to load inquiry data.');
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Server error. Failed to load inquiry data.');
          this.loading.set(false);
        }
      });
  }

  back() {
    this.location.back();
  }
}
