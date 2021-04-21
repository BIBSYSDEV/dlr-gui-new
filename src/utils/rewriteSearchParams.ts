import { SearchParameters } from '../types/search.types';

export const rewriteSearchParams = (
  parameterName: SearchParameters,
  listOfNewParams: string[],
  history: any,
  location: any
) => {
  const urlSearchTerms = new URLSearchParams(location.search);
  urlSearchTerms.delete(parameterName);
  listOfNewParams.forEach((parameter) => {
    urlSearchTerms.append(parameterName, parameter);
  });
  history.push('?' + urlSearchTerms.toString());
};
