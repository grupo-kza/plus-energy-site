"use client";

import { useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { MIN_BILL, MAX_BILL, calculateSavings } from "@/lib/constants";

interface BillSliderProps {
  value: number;
  onChange: (value: number) => void;
  showDetails?: boolean;
}

export function BillSlider({ value, onChange, showDetails = true }: BillSliderProps) {
  const savings = calculateSavings(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  const percentage = ((value - MIN_BILL) / (MAX_BILL - MIN_BILL)) * 100;

  return (
    <div className="w-full">
      {/* Slider label */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-pe-slate-600">
          Valor da sua conta de luz
        </label>
        <span className="text-2xl font-heading font-bold text-pe-green-700">
          {formatCurrency(value)}
        </span>
      </div>

      {/* Range slider */}
      <div className="relative mt-1 mb-4">
        <input
          type="range"
          min={MIN_BILL}
          max={MAX_BILL}
          step={50}
          value={value}
          onChange={handleChange}
          className="w-full"
          aria-label="Valor da conta de luz"
        />
        <div className="flex justify-between mt-1 text-xs text-pe-slate-400">
          <span>{formatCurrency(MIN_BILL)}</span>
          <span>{formatCurrency(MAX_BILL)}</span>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Savings highlight */}
          <div className="mt-6 p-5 bg-gradient-to-br from-pe-green-50 to-pe-solar-50 rounded-2xl border border-pe-green-200">
            <p className="text-sm text-pe-slate-600 mb-1">Economia estimada, em torno de</p>
            <p className="text-4xl font-heading font-extrabold text-pe-green-700">
              {formatCurrency(savings.monthly)}
              <span className="text-base font-normal text-pe-slate-500">/mês</span>
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-pe-slate-500 uppercase tracking-wide">Por ano</p>
                <p className="text-lg font-bold text-pe-green-800">
                  {formatCurrency(savings.yearly)}
                </p>
              </div>
              <div>
                <p className="text-xs text-pe-slate-500 uppercase tracking-wide">Em 2 anos</p>
                <p className="text-lg font-bold text-pe-green-800">
                  {formatCurrency(savings.twoYears)}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-pe-slate-500 leading-snug">
            {savings.ratePercent}% sobre a energia compensada (cerca de {formatCurrency(savings.compensated)} da sua conta).
            O mínimo da ligação, a iluminação pública e os encargos seguem com a RGE.
          </p>
        </>
      )}
    </div>
  );
}
