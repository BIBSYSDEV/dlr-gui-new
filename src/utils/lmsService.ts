import { Resource } from '../types/resource.types';
import { LMSTypes } from '../types/lms.types';
import { LMSParametersName } from '../types/LMSParameters';

const createEmbedUrlParam = (resource: Resource, width: number | string, height: number) => {
  return encodeURIComponent(
    `${window.location.origin}/resource/${resource.identifier}/content/main?width=${width}&height=${height}`
  );
};

const embedToBlackBoard = (resource: Resource, mode: string) => {
  const data = {
    id: resource.identifier,
    title: resource.features.dlr_title,
    handle: resource.features.dlr_identifier_handle,
    mode,
    embedCode: `<iframe src="${window.location.origin}/resource/${resource.identifier}/content/main?width={width}&height={height}" style="border: none;" width="{iframeWidth}" height="{iframeHeight}" allowfullscreen="true" ></iframe>`,
  };
  window.parent.postMessage(data, '*');
};

const embedToCanvas = (resource: Resource, mode: string, height: number, width: number) => {
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
    window.location.href = `${canvasReturnUrl}?return_type=iframe&allowfullscreen=true&width=${width}px&height=${height}px&url=${urlParam}`;
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

const embedToItsLearning = async (resource: Resource, mode: string, width: number, height: number) => {
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
        `<iframe src="${window.location.origin}/content/${resource.identifier}/content/main?width=${width}&height=${height}&useFeideSso=true" style="border: none;" width="${width}" height="${height}" allowfullscreen="true"></iframe>`
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
    embedCode: `<iframe src="${window.location.origin}/content/${resource.identifier}/content/main?width={width}&height={height}" style="border: none;" width="{iframeWidth}" height="{iframeHeight}" allowfullscreen="true" ></iframe>`,
  };

  window.parent.postMessage(data, '*');
};

export const embed = async (resource: Resource, mode: string, lmsPlatform: LMSTypes, width = 0, height = 0) => {
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
