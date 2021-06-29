import { LMSParametersName } from '../../src/types/LMSParameters';
import { resourcePath } from '../../src/AppRoutes';

context('Actions', () => {
  beforeEach(() => {
    cy.visit(`${resourcePath}/mock-id`);
  });

  const commonComponentsDisplayed = () => {
    cy.get('[data-testid=embed-typography-description]').should('exist');
    cy.get('[data-testid=embed-small-button]').should('exist');
    cy.get('[data-testid=embed-medium-button]').should('exist');
    cy.get('[data-testid=embed-large-button]').should('exist');
  };

  it('should not show anything without the correct search-params', () => {
    cy.get('[data-testid=embed-typography-description]').should('not.exist');
    cy.get('[data-testid=embed-link-button]').should('not.exist');
    cy.get('[data-testid=embed-small-button]').should('not.exist');
    cy.get('[data-testid=embed-medium-button]').should('not.exist');
    cy.get('[data-testid=embed-large-button]').should('not.exist');
    cy.get('[data-testid=embed-canvas-link]').should('not.exist');
  });

  it('should render buttons and text when blackboard search params is set', () => {
    cy.visit(`${resourcePath}/mock-id?${LMSParametersName.BBShowEmbedButton}=true`);
    commonComponentsDisplayed();
    cy.get('[data-testid=embed-link-button]').should('exist');
    cy.get('[data-testid=embed-canvas-link]').should('not.exist');
  });

  it('should render buttons and text when canvas search params is set', () => {
    cy.visit(
      `${resourcePath}/mock-id?${LMSParametersName.CanvasShowEmbedButton}=true&${LMSParametersName.CanvasShowEmbedLinkButton}=true&${LMSParametersName.CanvasLaunchPresentationReturnUrl}=https:\\blahblah`
    );
    commonComponentsDisplayed();
    cy.get('[data-testid=embed-link-button]').should('exist');
    cy.get('[data-testid=embed-canvas-link]').should('exist');
  });

  it('should render buttons and text when its learning search params is set', () => {
    cy.visit(
      `${resourcePath}/mock-id?${LMSParametersName.ItsLearningShowEmbedButton}=true&${LMSParametersName.ItsLearningReturnUrl}=https:\\blahblah`
    );
    commonComponentsDisplayed();
    cy.get('[data-testid=embed-link-button]').should('exist');
    cy.get('[data-testid=embed-canvas-link]').should('not.exist');
  });

  it('should render buttons and text when edx search params is set', () => {
    cy.visit(`${resourcePath}/mock-id?${LMSParametersName.EdxShowEmbedButton}=true`);
    commonComponentsDisplayed();
    cy.get('[data-testid=embed-link-button]').should('not.exist');
    cy.get('[data-testid=embed-canvas-link]').should('not.exist');
  });
});
