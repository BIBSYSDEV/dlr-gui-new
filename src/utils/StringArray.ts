//Does not mutate input stringArray
export const StringArrayToSetStringArray = (stringArray: string[]): string[] => {
  const seen = new Set();
  return stringArray.filter((element) => {
    const key = element.trim().toLowerCase();
    return seen.has(key) ? false : seen.add(key);
  });
};

//Does not mutate input stringArray
export const localeSort = (stringArray: string[]): string[] => {
  return stringArray.sort((elementA, elementB) => elementA.localeCompare(elementB));
};
