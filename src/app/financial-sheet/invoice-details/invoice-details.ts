import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './invoice-details.html',
  styleUrls: ['./invoice-details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailsComponent {

  private http = inject(HttpClient);
  private location = inject(Location);

  invoices = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.loadInvoices();
  }

  loadInvoices() {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      this.loading.set(false);
      return;
    }

    this.http.post("http://localhost:3001/invoice-details", { customerId })
      .subscribe({
        next: (res: any) => {
          this.invoices.set(res.invoices);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          alert("Unable to fetch invoice details from SAP");
          this.loading.set(false);
        }
      });
  }

  back() {
    this.location.back();
  }
}
