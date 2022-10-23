export const toLocaleDateString = (date: string | number | Date) => {
  return new Date(date)
    .toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
};