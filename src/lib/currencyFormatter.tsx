export const formatCurrency = (value: any) => {
  const formatter = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 2,
  })
  return formatter.format(value).replace("RWF", "Rwf")
}
export const formatCurrencyText = (value: any) => {
  const formatter = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 2,
  })
  return formatter.format(value).replace("RWF", "Rwf")
}
