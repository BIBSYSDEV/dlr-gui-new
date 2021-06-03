import { mockResource, mockWorkListRequestDOI } from '../../src/api/mockdata';

context('Actions', () => {
  beforeEach(() => {
    cy.visit(`/worklist`);
  });

  it('shows resource title as a link, submitter and submitted date', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=doi-request-item-title-${mockResource.identifier}]`).contains(mockResource.features.dlr_title);
    cy.get(`[data-testid=doi-request-item-submitter-${mockResource.identifier}]`).contains(
      mockWorkListRequestDOI[0].submitter
    );
    cy.get(`[data-testid=doi-request-item-submitted-${mockResource.identifier}]`).contains('28.04.2021');
  });

  it('shortens long comments', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=doi-request-item-comment-short-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should(
      'exist'
    );
    cy.get(`[data-testid=doi-request-item-comment-long-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should(
      'not.exist'
    );
    cy.get(
      `[data-testid=doi-request-item-comment-read-more-button-${mockWorkListRequestDOI[2].resourceIdentifier}]`
    ).click();
    cy.get(`[data-testid=doi-request-item-comment-short-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should(
      'not.exist'
    );
    cy.get(`[data-testid=doi-request-item-comment-long-${mockWorkListRequestDOI[2].resourceIdentifier}]`).should(
      'exist'
    );
  });

  it('removes listitem after creating DOI', () => {
    cy.get('[data-testid=doi-tab]').click();
    cy.get(`[data-testid=doi-request-item-title-${mockResource.identifier}]`).should('exist');
    cy.get(`[data-testid=create-doi-button-${mockResource.identifier}]`).click();
    cy.get(`[data-testid=confirm-create-doi-button-${mockResource.identifier}]`).click();
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
