import { mockMyResources } from '../../src/api/mockdata';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can se a list of published and unpublished resources', () => {
    cy.get('[data-testid=my-resources-link]').click();
    const publishedTestPost = mockMyResources[0];
    const unpublishedTestPost = mockMyResources[1];
    cy.get(`[data-testid=unpublished-tab]`).click();
    cy.get(`[data-testid=list-item-resources-${unpublishedTestPost.identifier}]`).should('exist');
    cy.get(`[data-testid=list-item-resources-${unpublishedTestPost.identifier}]`).contains(
      unpublishedTestPost.features.dlr_title
    );
    cy.get(`[data-testid=published-tab]`).click();
    cy.get(`[data-testid=list-item-resources-${unpublishedTestPost.identifier}]`).should('not.exist');
    cy.get(`[data-testid=list-item-resources-${publishedTestPost.identifier}]`).should('exist');
    cy.get(`[data-testid=list-item-resources-${publishedTestPost.identifier}]`).contains(
      publishedTestPost.features.dlr_title
    );
    cy.get(`[data-testid=unpublished-tab]`).click();
    cy.get(`[data-testid=list-item-resources-${unpublishedTestPost.identifier}]`).should('exist');
    cy.get(`[data-testid=list-item-resources-${publishedTestPost.identifier}]`).should('not.exist');
  });

  it('can delete a resource', () => {
    cy.get('[data-testid=my-resources-link]').click();
    cy.get(`[data-testid=published-tab]`).click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=delete-my-resources-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('exist');
    cy.get('[data-testid=delete-confirm-dialog-confirm-button-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=list-item-resources-123]').should('not.exist');
  });

  it('can start deleting, then aborting deletion by clicking on abort button', () => {
    cy.get('[data-testid=my-resources-link]').click();
    cy.get(`[data-testid=published-tab]`).click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=delete-my-resources-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('exist');
    cy.get('[data-testid=delete-confirm-dialog-abort-button-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=list-item-resources-123]').should('exist');
  });

  it('can start deleting, then aborting deletion by clicking outside the confirm-delete dialog', () => {
    cy.get('[data-testid=my-resources-link]').click();
    cy.get(`[data-testid=published-tab]`).click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=delete-my-resources-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('exist');
    cy.get('[data-testid=delete-confirm-dialog]').click(0, 0);
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=list-item-resources-123]').should('exist');
  });
});
