import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExchangeRateService } from '../exchange-rate.service';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CustomInputComponent, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, OnDestroy {
  converterForm: FormGroup;
  rates: { [key: string]: number } = {};

  private exchangeRateSubscription: Subscription | null = null;

  constructor(
    private exchangeRateService: ExchangeRateService,
    private fb: FormBuilder
  ) {
    this.converterForm = this.fb.group({
      amount1: [1, Validators.required],
      currency1: ['USD', Validators.required],
      amount2: [{ value: '', disabled: true }],
      currency2: ['UAH', Validators.required]
    });
  }

  ngOnInit(): void {
    this.exchangeRateSubscription = this.exchangeRateService.getExchangeRates()
    .pipe(
      tap((data) => {
        this.rates = data.rates;
        this.onConvert();
      }),
      catchError((error) => {
        console.error('Error fetching exchange rates:', error);
        throw error;
      }),
      finalize(() => {
        console.log('Finished fetching exchange rates');
      })
    )
  .subscribe();
  }

  ngOnDestroy(): void {
    if (this.exchangeRateSubscription) {
      this.exchangeRateSubscription.unsubscribe();
    }
  }

  onConvert(): void {
    const { amount1, currency1, currency2 } = this.converterForm.value;

    const rate1 = this.rates[currency1];
    const rate2 = this.rates[currency2];
    const convertedAmount = (amount1 / rate1) * rate2;

    this.converterForm.patchValue({ amount2: convertedAmount });
  }

  onAmountChange(): void {
    this.onConvert();
  }

  onCurrencyChange(): void {
    this.onConvert();
  }
}
