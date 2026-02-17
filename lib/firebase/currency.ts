export type Currency = 'DZD' | 'EUR' | 'USD';

export interface Country {
  code: string;
  name: string;
  currency: Currency;
}

export const countries: Country[] = [
  { code: 'DZ', name: 'Algeria', currency: 'DZD' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'BE', name: 'Belgium', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'PT', name: 'Portugal', currency: 'EUR' },
  { code: 'AT', name: 'Austria', currency: 'EUR' },
  { code: 'GR', name: 'Greece', currency: 'EUR' },
  { code: 'IE', name: 'Ireland', currency: 'EUR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'USD' },
  { code: 'AU', name: 'Australia', currency: 'USD' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'USD' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'USD' },
  { code: 'QA', name: 'Qatar', currency: 'USD' },
  { code: 'KW', name: 'Kuwait', currency: 'USD' },
  { code: 'MA', name: 'Morocco', currency: 'USD' },
  { code: 'TN', name: 'Tunisia', currency: 'USD' },
  { code: 'EG', name: 'Egypt', currency: 'USD' },
];

export const budgetRanges: Record<Currency, string[]> = {
  DZD: [
    '200,000 - 500,000 DZD',
    '500,000 - 1,000,000 DZD',
    '1,000,000 - 2,000,000 DZD',
    '2,000,000 - 5,000,000 DZD',
    '5,000,000+ DZD',
  ],
  EUR: [
    '1,000 - 3,000 €',
    '3,000 - 7,000 €',
    '7,000 - 15,000 €',
    '15,000 - 30,000 €',
    '30,000+ €',
  ],
  USD: [
    '$1,000 - $3,000',
    '$3,000 - $7,000',
    '$7,000 - $15,000',
    '$15,000 - $30,000',
    '$30,000+',
  ],
};

export function getCurrencyForCountry(countryCode: string): Currency {
  const country = countries.find(c => c.code === countryCode);
  return country?.currency || 'USD';
}

export function getBudgetOptions(currency: Currency): string[] {
  return budgetRanges[currency];
}
