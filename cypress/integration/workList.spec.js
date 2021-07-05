import { mockResource, mockUser, mockWorkListOwnerRequest, mockWorkListRequestDOI } from '../../src/api/mockdata';

context('Work List', () => {
  beforeEach(() => {
    cy.visit(`/worklist`);
  });

  it('shows resource title as a link, submitter and submitted date', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).contains(mockResource.features.dlr_title);
    cy.get(`[data-testid=request-item-submitter-${mockResource.identifier}]`).contains(
      mockWorkListRequestDOI[0].submitter
    );
    cy.get(`[data-testid=request-item-submitted-${mockResource.identifier}]`).contains('28.04.2021');
  });

  it('shortens long comments', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=request-item-comment-short-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should('exist');
    cy.get(`[data-testid=request-item-comment-long-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should(
      'not.exist'
    );
    cy.get(
      `[data-testid=request-item-comment-read-more-button-${mockWorkListRequestDOI[2].resourceIdentifier}]`
    ).click();
    cy.get(`[data-testid=request-item-comment-short-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should(
      'not.exist'
    );
    cy.get(`[data-testid=request-item-comment-long-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should('exist');
  });

  it('removes listitem after creating DOI', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=create-doi-button-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=confirm-create-doi-button]`).click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('not.exist');
  });

  it('is possible to reject a DOI request', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=show-delete-dialog-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=confirm-delete-request-button]`).should('be.disabled');
    cy.get(`[data-testid=delete-request-comment]`).type('bla blah');
    cy.get(`[data-testid=confirm-delete-request-button]`).click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('not.exist');
  });

  it('is possible to delete resource from report list', () => {
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=show-delete-resource-dialog-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=confirm-delete-button]`).click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('not.exist');
  });
  it('is possible to reject report request', () => {
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=show-delete-report-dialog-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=confirm-delete-button]`).click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('not.exist');
  });

  it('is possible to edit a reported resource', () => {
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=edit-resource-${mockResource.identifier}]`).click();
    cy.get('[data-testid=dlr-title-input]').should('exist');
  });

  it('should disable create-doi-button for resources without verified creators', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=create-doi-button-1234]`).should('exist').should('be.disabled');
  });

  it('renders current resource owner for ownership requests', () => {
    cy.get('[data-testid=ownership-tab]').click();
    cy.get(`[data-testid=request-item-resource-owner-${mockWorkListOwnerRequest[0].resourceIdentifier}]`).contains(
      mockUser.id
    );
  });

  it('is possible to reject ownership request', () => {
    cy.get('[data-testid=ownership-tab]').click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=show-delete-dialog-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=confirm-delete-request-button]`).should('be.disabled');
    cy.get(`[data-testid=delete-request-comment]`).type('bla blah');
    cy.get(`[data-testid=confirm-delete-request-button]`).click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('not.exist');
  });

  it('is possible to grant ownership with submitter id as default new owner', () => {
    cy.get('[data-testid=ownership-tab]').click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=grant-ownership-button-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=grant-ownership-request-email-text-field]`).should('have.value', 'epost@epost.no');
    cy.get(`[data-testid=confirm-grant-ownership-button]`).click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('not.exist');
  });

  it('is possible to grant ownership with specified id as new owner', () => {
    cy.get('[data-testid=ownership-tab]').click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=grant-ownership-button-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=grant-ownership-request-email-text-field]`).clear().type('banana@banana.no');
    cy.get(`[data-testid=confirm-grant-ownership-button]`).click();
    cy.get(`[data-testid=request-item-title-${mockResource.identifier}]`).should('not.exist');
  });
});
