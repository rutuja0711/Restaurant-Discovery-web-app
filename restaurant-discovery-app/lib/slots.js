const SLOT_MINUTES = 45;
const OPEN_HOUR = 11;  // 11:00 AM
const CLOSE_HOUR = 23; // 11:00 PM, last slot starts before this

// Generates fixed 45-min slot start times for a given date (YYYY-MM-DD)
export function generateSlotsForDate(dateStr) {
  const slots = [];
  const [year, month, day] = dateStr.split('-').map(Number);

  let current = new Date(year, month - 1, day, OPEN_HOUR, 0, 0);
  const closing = new Date(year, month - 1, day, CLOSE_HOUR, 0, 0);

  while (current < closing) {
    slots.push(new Date(current));
    current = new Date(current.getTime() + SLOT_MINUTES * 60000);
  }
  return slots;
}

export function getSlotEnd(slotStart) {
  return new Date(new Date(slotStart).getTime() + SLOT_MINUTES * 60000);
}

export function formatSlotLabel(date) {
  return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
