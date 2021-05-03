export const getSourceFromIframeString = (iframe: string): string => {
  return iframe
    .split(' ')
    .filter((section) => section.includes('src='))
    .join('')
    .replaceAll('src="', '')
    .replaceAll('></iframe>', '');
};
