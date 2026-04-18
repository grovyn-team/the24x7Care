export function phoneToTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return '#';
  return cleaned.startsWith('+') ? `tel:${cleaned}` : `tel:+${cleaned}`;
}
