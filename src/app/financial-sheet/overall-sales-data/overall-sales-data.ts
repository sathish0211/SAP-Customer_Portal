import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-overall-sales-data',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './overall-sales-data.html',
  styleUrls: ['./overall-sales-data.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverallSalesDataComponent {

  private http = inject(HttpClient);
  private location = inject(Location);

  summary = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.loadSummary();
  }

  loadSummary() {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      this.loading.set(false);
      return;
    }

    this.http.post("http://localhost:3001/overall-sales-data", { customerId })
      .subscribe({
        next: (res: any) => {
          this.summary.set(res.summary);
          this.loading.set(false);
        },
        error: (err) => {
          console.error("Overall Sales Data Error:", err);
          alert("Unable to fetch Overall Sales Data from SAP");
          this.loading.set(false);
        }
      });
  }

  back() {
    this.location.back();
  }
}
