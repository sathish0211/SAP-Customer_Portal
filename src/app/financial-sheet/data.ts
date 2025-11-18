import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private invoiceDetails = signal<any[]>([
    { invoice: 'INV-001', date: '2024-07-01', amount: 1500, status: 'Paid' },
    { invoice: 'INV-002', date: '2024-07-15', amount: 2500, status: 'Unpaid' },
    { invoice: 'INV-003', date: '2024-07-20', amount: 500, status: 'Paid' },
  ]);

  private paymentsAndAging = signal<any[]>([
    { payment: 'PMT-001', date: '2024-07-05', amount: 1500 },
    { payment: 'PMT-002', date: '2024-07-25', amount: 500 },
  ]);

  private creditDebitMemo = signal<any[]>([
    { memo: 'MEM-001', date: '2024-07-10', amount: -200, type: 'Credit' },
  ]);

  private overallSalesData = signal<any>({
    totalSales: 4500,
    totalPayments: 2000,
    balance: 2500
  });

  getInvoiceDetails() {
    return this.invoiceDetails.asReadonly();
  }

  getPaymentsAndAging() {
    return this.paymentsAndAging.asReadonly();
  }

  getCreditDebitMemo() {
    return this.creditDebitMemo.asReadonly();
  }

  getOverallSalesData() {
    return this.overallSalesData.asReadonly();
  }
}
