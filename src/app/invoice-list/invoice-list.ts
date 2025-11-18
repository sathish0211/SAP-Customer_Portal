import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../invoice';
import { CommonModule, Location } from '@angular/common';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceList {
  private route = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);
  private location = inject(Location);

  invoices$: Observable<any[] | undefined> = this.route.queryParams.pipe(
    map(params => params['type']),
    switchMap(type => this.invoiceService.getInvoices(type))
  );

  title$ = this.route.queryParams.pipe(
    map(params => {
      switch (params['type']) {
        case 'inquiry':
          return 'Inquiry Data';
        case 'sales':
          return 'Sales Order';
        case 'delivery':
          return 'Delivery List';
        default:
          return 'Invoice List';
      }
    })
  );

  back() {
    this.location.back();
  }
}
