export interface InvoiceTotals {
  lines: number[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

const round2 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Mirrors the backend calculation: the discount comes off the subtotal and tax
 * is charged on what remains, each rounded to 2 decimal places.
 */
export function calculateInvoiceTotals(
  items: { quantity: number; priceEach: number }[],
  discountPercent = 0,
  taxPercent = 0,
): InvoiceTotals {
  const lines = items.map((item) =>
    round2((item.quantity || 0) * (item.priceEach || 0)),
  );
  const subtotal = round2(lines.reduce((sum, line) => sum + line, 0));
  const discountAmount = round2((subtotal * (discountPercent || 0)) / 100);
  const taxable = subtotal - discountAmount;
  const taxAmount = round2((taxable * (taxPercent || 0)) / 100);
  const total = round2(taxable + taxAmount);
  return { lines, subtotal, discountAmount, taxAmount, total };
}
