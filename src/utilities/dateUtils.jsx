/**
 * Checks if the current date is past a given date string.
 * @param {string} dateString - The date to compare, in 'YYYY-MM-DD' format.
 * @returns {boolean} - True if the current date is past the given date, false otherwise.
 */
export const isDatePast = (dateString) => {
  if (!dateString) {
    return false;
  }

  // Get today's date and set time to midnight for a pure date comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create a date object from the input string.
  // Splitting and creating the date avoids timezone issues that can occur with new Date('YYYY-MM-DD')
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);

  // Compare today's date with the target date
  return today > targetDate;
};
