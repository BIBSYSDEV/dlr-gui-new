import { SearchParameters } from '../types/search.types';
import { API_PATHS, API_URL } from './constants';

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

const ParamsSplitter = 'ZZZZ';
const ValuePairSplitter = 'WWWW';

//Hacky workaround: this piece of code exists because feide-login deletes all but one search params in the redirect url.
//In order to retain the search params the valuePairs are concatenated into one big search param.
export const getPackedUrlForFeideLogin = (): string => {
  const searchParams = new URLSearchParams(window.location.search);
  const newParamsArray: string[] = [];
  searchParams.forEach((value, key) => newParamsArray.push(`${key}${ValuePairSplitter}${value}`));
  const newParams = newParamsArray.length > 0 ? `?${newParamsArray.join(ParamsSplitter)}=t` : '';
  const originHref = window.location.origin + '/loginRedirect' + window.location.pathname + newParams;
  return `${API_URL}${API_PATHS.guiBackendLoginPath}/feideLogin?target=${originHref}`;
};

export const unpackFeideLogin = (): string => {
  let newPathName = window.location.pathname.replace('/loginRedirect', '');
  if (newPathName.length === 0) {
    newPathName = '/';
  }
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.delete('token');
  //the search params received from feide-login have been concatenated into one large search param
  let newSearchParams = searchParams.toString().length > 0 ? '?' : '';
  searchParams.forEach((value, key) => {
    const paramsList = key.split(ParamsSplitter);
    paramsList.forEach((valuePair, index) => {
      const pairs = valuePair.split(ValuePairSplitter);
      if (index === 0) {
        newSearchParams += `${pairs[0]}=${pairs[1]}`;
      } else {
        newSearchParams += `&${pairs[0]}=${pairs[1]}`;
      }
    });
  });
  return newPathName + newSearchParams;
};
