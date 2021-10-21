//Does not mutate input stringArray

import { TFunction } from 'react-i18next';

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

//Does not mutate input stringArray
export const generateListWithOxfordComma = (stringArray: string[], t: TFunction<'translation'>): string => {
  if (stringArray.length > 2) {
    return `${stringArray.slice(0, stringArray.length - 1).join(', ')}${t('common.oxford_comma')} ${
      stringArray[stringArray.length - 1]
    }`;
  } else {
    return stringArray.join(` ${t('common.and').toLowerCase()} `);
  }
};
