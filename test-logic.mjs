

// Since it's TS we need to transpile, let's just copy the function logic to test it.
const items = [{ price: 100, quantity: 2 }]; // subtotal 200
const taxRate = 10; // 10%

function calc(items, taxRate, discountType, discountValue) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  let discountAmount = 0
  if (discountType === 'percentage') {
    discountAmount = subtotal * (discountValue / 100)
  } else if (discountType === 'fixed') {
    discountAmount = discountValue
  }
  const afterDiscount = Math.max(0, subtotal - discountAmount)
  const taxAmount = afterDiscount * (taxRate / 100)
  const total = afterDiscount + taxAmount

  return { subtotal, taxAmount, total }
}

console.log("Scenario A (No discount):", calc(items, 10, 'fixed', 0));
console.log("Scenario B (Percentage 10%):", calc(items, 10, 'percentage', 10));
console.log("Scenario C (Fixed 50):", calc(items, 10, 'fixed', 50));
