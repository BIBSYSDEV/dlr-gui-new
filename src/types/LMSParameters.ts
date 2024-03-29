export enum LMSParametersName {
  ForceAuthentication = 'forceAuthentication',
  Navbar = 'navbar',
  Sidebar = ' sidebar', // can be ignored
  Carousel = 'carousel', //can be ignored
  Footer = 'footer', //does not exist in old DLR
  PollForLogin = 'pollForLogin', //used for allowing user to login once for multiple iframes

  BBIframeResize = 'bbIframeResize',
  BBShowEmbedButton = 'bbShowEmbedButton',
  BBShowPublisher = 'bbShowPublisher',

  EdxIframeResize = 'edxIframeResize',
  EdxShowEmbedButton = 'edxShowEmbedButton',
  EdxShowPublisher = 'edxShowPublisher',

  ItsLearningShowEmbedButton = 'itsLearningShowEmbedButton',
  ItsLearningReturnUrl = 'itsLearningReturnUrl',

  CanvasIframeResize = 'canvasIframeResize',
  CanvasShowEmbedButton = 'canvasShowEmbedButton',
  CanvasShowEmbedLinkButton = 'canvasShowEmbedLinkButton',
  CanvasLaunchPresentationReturnUrl = 'canvasLaunchPresentationReturnUrl',
  View = 'view',
}
