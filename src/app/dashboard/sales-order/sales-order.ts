import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-order',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './sales-order.html',
  styleUrls: ['./sales-order.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesOrderComponent {

  private http = inject(HttpClient);
  private location = inject(Location);

  orders = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      this.loading.set(false);
      return;
    }

    this.http.post("http://localhost:3001/sales-order", { customerId })
      .subscribe({
        next: (res: any) => {
          // Backend sends: { status: "SUCCESS", salesOrders: [...] }
          this.orders.set(res.salesOrders || []);
          this.loading.set(false);
        },
        error: () => {
          alert("Unable to fetch Sales Orders from SAP");
          this.loading.set(false);
        }
      });
  }

  back() {
    this.location.back();
  }
}
