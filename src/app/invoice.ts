import { Injectable } from '@angular/core';
import { of } from 'rxjs';

interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  amount: number;
  currency: string;
  soldTo: number;
  billTo: number;
  salesOrg: string;
  createdOn: string;
  distChannel: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  getInvoices(type: string) {
    const data: { [key: string]: Invoice[] } = {
      inquiry: [
        {
          invoiceNo: '90000000',
          invoiceDate: '2025-05-15',
          amount: 1232,
          currency: 'EUR',
          soldTo: 2,
          billTo: 2,
          salesOrg: 'Z001',
          createdOn: '2025-05-15',
          distChannel: 1
        },
        {
          invoiceNo: '90000001',
          invoiceDate: '2025-05-15',
          amount: 1600,
          currency: 'INR',
          soldTo: 2,
          billTo: 2,
          salesOrg: 'Z001',
          createdOn: '2025-05-15',
          distChannel: 1
        }
      ],
      sales: [
        {
          invoiceNo: '90000003',
          invoiceDate: '2025-05-15',
          amount: 647,
          currency: 'EUR',
          soldTo: 2,
          billTo: 2,
          salesOrg: 'Z001',
          createdOn: '2025-05-15',
          distChannel: 1
        },
        {
          invoiceNo: '90000004',
          invoiceDate: '2025-05-15',
          amount: 642,
          currency: 'EUR',
          soldTo: 2,
          billTo: 2,
          salesOrg: 'Z001',
          createdOn: '2025-05-15',
          distChannel: 1
        }
      ],
      delivery: [
        {
          invoiceNo: '90000006',
          invoiceDate: '2025-05-15',
          amount: 118,
          currency: 'INR',
          soldTo: 2,
          billTo: 2,
          salesOrg: 'Z001',
          createdOn: '2025-05-15',
          distChannel: 1
        },
        {
          invoiceNo: '90000018',
          invoiceDate: '2025-05-20',
          amount: 104,
          currency: 'EUR',
          soldTo: 2,
          billTo: 2,
          salesOrg: 'Z001',
          createdOn: '2025-05-20',
          distChannel: 1
        }
      ]
    };
    return of(data[type]);
  }
}
