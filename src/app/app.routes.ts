import { Routes } from '@angular/router';

import { Home } from './home/home';
import { ProfileComponent as Profile } from './profile/profile';

// -------- Dashboard parent page --------
import { DashboardComponent } from './dashboard/dashboard';

// -------- Dashboard sub-pages --------
import { InquiryDataComponent } from './dashboard/inquiry-data/inquiry-data';
import { SalesOrderComponent } from './dashboard/sales-order/sales-order';
import { DeliveryListComponent } from './dashboard/delivery-list/delivery-list';

// -------- Finance Sheet --------
import { FinancialSheetComponent } from './financial-sheet/financial-sheet';
import { InvoiceDetailsComponent } from './financial-sheet/invoice-details/invoice-details';
import { PaymentsAndAgingComponent } from './financial-sheet/payments-and-aging/payments-and-aging';
import { CreditDebitMemoComponent } from './financial-sheet/credit-debit-memo/credit-debit-memo';
import { OverallSalesDataComponent } from './financial-sheet/overall-sales-data/overall-sales-data';
import { InquiryDataComponent as InquiryDataFinanceComponent } 
        from './financial-sheet/inquiry-data/inquiry-data';

import { InvoiceList } from './invoice-list/invoice-list';
import { Login } from './login/login';


export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: 'home',
    component: Home,
    children: [

      // Profile
      { path: 'profile', component: Profile },

      // Dashboard (parent page)
      { path: 'dashboard', component: DashboardComponent },

      // Dashboard sub pages
      { path: 'inquiry-data', component: InquiryDataComponent },
      { path: 'sales-order', component: SalesOrderComponent },
      { path: 'delivery-list', component: DeliveryListComponent },

      // Finance Sheet
      { path: 'finance-sheet', component: FinancialSheetComponent },
      { path: 'invoice-details', component: InvoiceDetailsComponent },
      { path: 'payments-and-aging', component: PaymentsAndAgingComponent },
      { path: 'credit-debit-memo', component: CreditDebitMemoComponent },
      { path: 'overall-sales-data', component: OverallSalesDataComponent },
      { path: 'finance-inquiry-data', component: InquiryDataFinanceComponent },

      // Invoice List
      { path: 'invoice-list', component: InvoiceList },

      // Default under home
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
