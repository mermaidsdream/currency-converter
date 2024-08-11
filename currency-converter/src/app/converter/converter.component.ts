import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../exchange-rate.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {

  amount1: number = 1;
  currency1: string = 'USD';
  amount2: number | undefined;
  currency2: string = 'UAH';
  rates: any;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRateService.getExchangeRates().subscribe(data => {
      this.rates = data.rates;
      this.convertCurrency();
    });
  }

  convertCurrency(): void {
    const rate1 = this.rates[this.currency1];
    const rate2 = this.rates[this.currency2];
    this.amount2 = (this.amount1 / rate1) * rate2;
  }

  onAmountChange(): void {
    this.convertCurrency();
  }

  onCurrencyChange(): void {
    this.convertCurrency();
  }
}

