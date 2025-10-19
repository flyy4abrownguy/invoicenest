'use client';

import { Currency } from '@/lib/types';
import { CURRENCY_NAMES, CURRENCY_SYMBOLS } from '@/lib/utils/calculations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (value: Currency) => void;
  disabled?: boolean;
}

const currencies: Currency[] = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'INR',
  'CHF',
  'CNY',
  'SEK',
];

export function CurrencySelector({
  value,
  onChange,
  disabled = false,
}: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {CURRENCY_SYMBOLS[currency]} {currency} - {CURRENCY_NAMES[currency]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
