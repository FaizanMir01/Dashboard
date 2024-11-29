/**
 * Calculates the average value of a specified field across an array of sale data objects.
 * 
 * @param {Object[]} data - An array of sale data objects.
 * @param {string} field - The name of the field to calculate the average for.
 * @returns {number} The calculated average, rounded to two decimal places.
 */
export function calculateAverage(data, field) {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + Number(item[field]), 0);
  return Number((sum / data.length).toFixed(2));
}