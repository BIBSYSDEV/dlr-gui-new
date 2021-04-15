import { QueryObject } from '../types/search.types';

//ignores queryFromURL and allowSearch attributes on QueryObjects.
export const queryObjectIsEquals = (a: QueryObject, b: QueryObject): boolean => {
  try {
    if (
      a.query !== b.query ||
      a.showInaccessible !== b.showInaccessible ||
      a.offset !== b.offset ||
      a.licenses.length !== b.licenses.length ||
      a.tags.length !== b.tags.length ||
      a.resourceTypes.length !== b.resourceTypes.length ||
      a.institutions.length !== b.institutions.length
    ) {
      return false;
    }
    const licensesA = a.licenses.slice().sort();
    const licenseB = b.licenses.slice().sort();
    if (!licensesA.every((element, index) => element === licenseB[index])) {
      return false;
    }
    const tagsA = a.tags.slice().sort();
    const tagsB = b.tags.slice().sort();
    if (!tagsA.every((element, index) => element === tagsB[index])) {
      return false;
    }
    const resourceTypesA = a.resourceTypes.slice().sort();
    const resourceTypesB = b.resourceTypes.slice().sort();
    if (!resourceTypesA.every((element, index) => element === resourceTypesB[index])) {
      return false;
    }
    const institutionsA = a.institutions.slice().sort();
    const institutionsB = b.institutions.slice().sort();
    return institutionsA.every((element, index) => element === institutionsB[index]);
  } catch (error) {
    return false;
  }
};
