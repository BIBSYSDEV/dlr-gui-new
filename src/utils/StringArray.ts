export const StringArrayToSetStringArray = (a: string[]): string[] => {
  const seen = new Set();
  return a.filter((item) => {
    const k = item.trim().toLowerCase();
    return seen.has(k) ? false : seen.add(k);
  });
};

export const localeSort = (array: string[]): string[] => {
  return array.sort((elementA, elementB) => elementA.localeCompare(elementB));
};
