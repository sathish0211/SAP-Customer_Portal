import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit-debit-memo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './credit-debit-memo.html',
  styleUrls: ['./credit-debit-memo.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditDebitMemoComponent {

  private http = inject(HttpClient);
  private location = inject(Location);

  memos = signal<any[]>([]);
  loading = signal(true);

  constructor() {
    this.loadMemos();
  }

  loadMemos() {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      this.loading.set(false);
      return;
    }

    this.http.post("http://localhost:3001/credit-debit-memo", { customerId })
      .subscribe({
        next: (res: any) => {
          this.memos.set(res.memos);
          this.loading.set(false);
        },
        error: (err) => {
          console.error("Credit/Debit memo error:", err);
          alert("Unable to fetch Credit/Debit Memo from SAP");
          this.loading.set(false);
        }
      });
  }

  back() {
    this.location.back();
  }
}
