import { Resource } from '../types/resource.types';
import { LMSTypes } from '../types/lms.types';
import { LMSParametersName } from '../types/LMSParameters';
import { resourcePath } from './constants';

const createEmbedUrlParam = (resource: Resource, width: number | string, height: number | string) => {
  return encodeURIComponent(
    `${window.location.origin}${resourcePath}/${resource.identifier}/content/main?${LMSParametersName.Navbar}=false&${LMSParametersName.Footer}=false&width=${width}&height=${height}&${LMSParametersName.PollForLogin}=true`
  );
};

const embedToBlackBoard = (resource: Resource, mode: string) => {
  const data = {
    id: resource.identifier,
    title: resource.features.dlr_title,
    handle: resource.features.dlr_identifier_handle,
    mode,
    embedCode: `<iframe src="${window.location.origin}${resourcePath}/${resource.identifier}/content/main?${LMSParametersName.Navbar}=false&${LMSParametersName.Footer}=false&width={width}&height={height}&${LMSParametersName.PollForLogin}=true" style="border: none;" width="{iframeWidth}" height="{iframeHeight}" allowfullscreen="true" ></iframe>`,
  };
  window.parent.postMessage(data, '*');
};

const embedToCanvas = (resource: Resource, mode: string, height: string, width: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  const canvasReturnUrl = searchParams.get(LMSParametersName.CanvasLaunchPresentationReturnUrl);
  if (mode === 'link') {
    window.location.href = `${canvasReturnUrl}?return_type=url&target=_blank&title=link&text=${resource.features.dlr_title.replaceAll(
      '"',
      ''
    )}&url=${resource.features.dlr_identifier_handle}`;
  }
  if (mode === 'canvasShowEmbedLinkButton') {
    const urlParam = createEmbedUrlParam(resource, 'full', 315);
    window.location.href = `${canvasReturnUrl}?return_type=lti_launch_url&title=${resource.features.dlr_title.replaceAll(
      '"',
      ''
    )}&url=${urlParam}`;
  } else {
    const urlParam = createEmbedUrlParam(resource, width, height);
    window.location.href = `${canvasReturnUrl}?return_type=iframe&allowfullscreen=true&width=${width}&height=${height}&url=${urlParam}`;
  }
};

//Hacky workaround for bypassing CORS policy at ItsLearning. Cannot be replaced with axios.
const postToItsLearning = (itsLearningReturnUrl: string, html: string) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = itsLearningReturnUrl;
  const input = document.createElement('input');
  input.name = 'insertedHtml';
  input.value = html;
  input.type = 'hidden';
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
};

const embedToItsLearning = async (resource: Resource, mode: string, width: string, height: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  const itsLearningReturnUrl = searchParams.get(LMSParametersName.ItsLearningReturnUrl);

  if (itsLearningReturnUrl) {
    if (mode === 'link') {
      postToItsLearning(
        itsLearningReturnUrl,
        `<a href="${resource.features.dlr_identifier_handle}">${resource.features.dlr_title.replaceAll('"', '')}</a>`
      );
    } else {
      postToItsLearning(
        itsLearningReturnUrl,
        `<iframe src="${window.location.origin}${resourcePath}/${resource.identifier}/content/main?navbar=false&footer=false&width=${width}&height=${height}&useFeideSso=true&${LMSParametersName.PollForLogin}=true" style="border: none;" width="${width}" height="${height}" allowfullscreen="true"></iframe>`
      );
    }
  } else {
    const error = new Error('ItsLearning return url is missing');
    error.message = 'itsLearningReturnUrl search param is either missing or invalid';
    throw error;
  }
};

const embedToEdx = (resource: Resource, mode: string) => {
  const data = {
    id: resource.identifier,
    title: resource.features.dlr_title,
    handle: resource.features.dlr_identifier_handle,
    mode: mode, // ex.: embed size ('560x315' or 'link')
    embedCode: `<iframe src="${window.location.origin}${resourcePath}/${resource.identifier}/content/main?navbar=false&footer=false&width={width}&height={height}&${LMSParametersName.PollForLogin}=true" style="border: none;" width="{iframeWidth}" height="{iframeHeight}" allowfullscreen="true" ></iframe>`,
  };

  window.parent.postMessage(data, '*');
};

export const embed = async (resource: Resource, mode: string, lmsPlatform: LMSTypes, width = '', height = '') => {
  switch (lmsPlatform) {
    case LMSTypes.BlackBoard:
      embedToBlackBoard(resource, mode);
      break;
    case LMSTypes.Canvas:
      embedToCanvas(resource, mode, height, width);
      break;
    case LMSTypes.ItsLearning:
      await embedToItsLearning(resource, mode, height, width);
      break;
    case LMSTypes.Edx:
      embedToEdx(resource, mode);
      break;
    default:
      break;
  }
};

export const getLMSSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const newSearchParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (Object.values(LMSParametersName).includes(key as LMSParametersName)) {
      newSearchParams.append(key, value);
    }
  });
  return newSearchParams;
};

export const generateNewUrlAndRetainLMSParams = (
  newPath: string,
  searchParamsThatNeedsToBeRetained?: URLSearchParams
) => {
  const newSearchParams = getLMSSearchParams();
  if (searchParamsThatNeedsToBeRetained) {
    searchParamsThatNeedsToBeRetained.forEach((value, key) => {
      newSearchParams.append(key, value);
    });
  }
  return `${newPath}${newSearchParams.toString().length > 0 ? `?${newSearchParams}` : ''}`;
};
