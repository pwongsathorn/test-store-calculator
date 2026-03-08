export const { format: currencyFormatter } = Intl.NumberFormat('en-GB', {
  notation: 'compact',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const { format: numberFormatter } = Intl.NumberFormat('en-GB', {
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
