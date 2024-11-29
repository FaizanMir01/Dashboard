/**
 * Represents the structure of sale data.
 * @typedef {Object} SaleData
 * @property {number} paymentId - The unique identifier for the payment.
 * @property {number} outletId - The identifier for the outlet where the sale occurred.
 * @property {string} saleDate - The date of the sale.
 * @property {string} saleTime - The time of the sale.
 * @property {string} product - The name of the product sold.
 * @property {string} sku - The Stock Keeping Unit (SKU) of the product.
 * @property {number} quantity - The quantity of the product sold.
 * @property {number} unitPrice - The price per unit of the product.
 * @property {number} amount - The total amount of the sale.
 * @property {number} discount - The discount applied to the sale.
 * @property {string} subzone - The subzone where the sale occurred.
 */

// Example usage:
const SaleData = {
  paymentId: 1234,
  outletId: 5678,
  saleDate: '2023-05-15',
  saleTime: '14:30:00',
  product: 'Widget',
  sku: 'WDG-001',
  quantity: 2,
  unitPrice: 19.99,
  amount: 39.98,
  discount: 5.00,
  subzone: 'North'
};