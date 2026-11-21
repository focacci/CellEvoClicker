const LONG = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion',
  'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion',
  'Quattuordecillion', 'Quindecillion', 'Sexdecillion', 'Septendecillion', 'Octodecillion', 'Novemdecillion', 'Vigintillion']
const SHORT = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc',
  'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg']

// 1234567.8 -> "1,234,567"
export function commas(n) {
  return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Splits n into a value under 1000 and its thousands tier (999.9996 rounds up to 1.000 of the next tier)
function tier(n, digits) {
  let t = Math.floor(Math.log10(n) / 3)
  let v = n / 1000 ** t
  if (Number(v.toFixed(digits)) >= 1000) { t++; v /= 1000 }
  return [v, t]
}

// Header style: "999,999" then "1.234 Million". trim drops trailing zeros: "150 Billion"
export function long(n, trim = false) {
  n = Math.floor(n)
  if (n < 1e6) return commas(n)
  const [v, t] = tier(n, 3)
  if (t >= LONG.length) return n.toExponential(3).replace('e+', 'e')
  return (trim ? String(Number(v.toFixed(3))) : v.toFixed(3)) + ' ' + LONG[t]
}

// Button style: "2.5", "9,999" then "12.34K", "5.67B"
export function short(n) {
  if (n < 1000) return String(Number(n.toFixed(2)))
  if (n < 1e4) return commas(n)
  const [v, t] = tier(n, 2)
  if (t >= SHORT.length) return n.toExponential(2).replace('e+', 'e')
  return v.toFixed(2) + SHORT[t]
}
