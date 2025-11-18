import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-financial-sheet',
  imports: [
    RouterModule
  ],
  templateUrl: './financial-sheet.html',
  styleUrls: ['./financial-sheet.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialSheetComponent {

}
