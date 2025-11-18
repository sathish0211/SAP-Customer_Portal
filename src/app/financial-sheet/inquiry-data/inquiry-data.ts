import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inquiry-data',
  templateUrl: './inquiry-data.html',
  styleUrls: ['./inquiry-data.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class InquiryDataComponent {
  private router = inject(Router);

  public inquiryData = [
    { salesOrg: 'ASML', createdOn: '01.01.2023', distChannel: 'Direct' },
    { salesOrg: 'ASML', createdOn: '02.01.2023', distChannel: 'Direct' },
    { salesOrg: 'ASML', createdOn: '03.01.2023', distChannel: 'Direct' },
    { salesOrg: 'ASML', createdOn: '04.01.2023', distChannel: 'Direct' },
    { salesOrg: 'ASML', createdOn: '05.01.2023', distChannel: 'Direct' },
  ];

  back() {
    this.router.navigate(['../']);
  }
}
