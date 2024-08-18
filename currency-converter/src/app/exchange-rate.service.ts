import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private exchangeRatesCache: any = null;
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/UAH';

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<any> {
    if (this.exchangeRatesCache) {
      return of(this.exchangeRatesCache);
    } else {
      return this.http.get(this.apiUrl).pipe(
        tap((data: any) => this.exchangeRatesCache = data)
      );
    }
  }
}
