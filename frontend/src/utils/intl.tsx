export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(navigator.language).format(date);
}

export function formatRelativeTimeDate(date: Date, locale?: string) {
  return new Intl.RelativeTimeFormat(locale || navigator.language, {
    localeMatcher: "best fit",
    numeric: "auto",
    style: "long",
  }).format(-(new Date().getHours() - date.getHours()), "days");
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat(navigator.language).format(number);
}
