import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './delivery-list.html',
  styleUrls: ['./delivery-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryListComponent {

  private http = inject(HttpClient);
  private location = inject(Location);

  deliveries = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.loadDeliveries();
  }

  loadDeliveries() {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      this.loading.set(false);
      return;
    }

    this.http.post("http://localhost:3001/delivery", { customerId })
      .subscribe({
        next: (res: any) => {
          this.deliveries.set(res.deliveries);
          this.loading.set(false);
        },
        error: () => {
          alert("Unable to fetch Delivery List");
          this.loading.set(false);
        }
      });
  }

  back() {
    this.location.back();
  }
}
