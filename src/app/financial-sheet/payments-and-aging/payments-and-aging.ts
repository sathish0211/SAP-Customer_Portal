import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments-and-aging',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './payments-and-aging.html',
  styleUrls: ['./payments-and-aging.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsAndAgingComponent {

  private http = inject(HttpClient);
  private location = inject(Location);

  payments = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.loadPayments();
  }

  loadPayments() {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      this.loading.set(false);
      return;
    }

    this.http.post("http://localhost:3001/payments-aging", { customerId })
      .subscribe({
        next: (res: any) => {
          this.payments.set(res.payments);
          this.loading.set(false);
        },
        error: (err) => {
          console.error("Payments error:", err);
          alert("Unable to fetch Payments & Aging from SAP");
          this.loading.set(false);
        }
      });
  }

  back() {
    this.location.back();
  }
}
