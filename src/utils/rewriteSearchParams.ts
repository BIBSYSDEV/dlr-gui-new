import { SearchParameters } from '../types/search.types';

export const rewriteSearchParams = (
  parameterName: SearchParameters,
  listOfNewParams: string[],
  history: any,
  location: any,
  removePage = false
) => {
  const urlSearchTerms = new URLSearchParams(location.search);
  urlSearchTerms.delete(parameterName);
  if (removePage) urlSearchTerms.delete('page');
  listOfNewParams.forEach((parameter) => {
    urlSearchTerms.append(parameterName, parameter);
  });
  history.push('?' + urlSearchTerms.toString());
};
