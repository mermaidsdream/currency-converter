import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../exchange-rate.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usdRate: number | undefined;
  eurRate: number | undefined;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRateService.getExchangeRates().subscribe(data => {
      this.usdRate = data.rates.USD;
      this.eurRate = data.rates.EUR;
    });
  }
}
