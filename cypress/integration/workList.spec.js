import { mockResource } from '../../src/api/mockdata';

context('Actions', () => {
  beforeEach(() => {
    cy.visit(`/worklist`);
  });

  it('shows resource title as a link', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=doi-request-item-title-${mockResource.identifier}]`).contains(mockResource.features.dlr_title);
  });

  it('removes listitem after creating DOI', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=doi-request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=create-doi-button-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=doi-request-item-title-${mockResource.identifier}]`).should('not.exist');
  });

  it('is possible to reject a DOI request', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=doi-request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=show-delete-dialog-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=confirm-delete-doi-button-${mockResource.identifier}]`).should('be.disabled');
    cy.get(`[data-testid=delete-doi-request-comment-${mockResource.identifier}]`).type('bla blah');
    cy.get(`[data-testid=confirm-delete-doi-button-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=doi-request-item-title-${mockResource.identifier}]`).should('not.exist');
  });
});
