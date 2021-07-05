import { mockMyResources } from '../../src/api/mockdata';

context('My resources', () => {
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

  it('can edit a resource', () => {
    const unpublishedTestPost = mockMyResources[1];
    const newTitle = 'new title';
    cy.get('[data-testid=my-resources-link]').click();
    cy.get(`[data-testid=unpublished-tab]`).click();
    cy.get(`[data-testid=edit-resource-button-${unpublishedTestPost.identifier}]`).click();
    cy.get('[data-testid=dlr-title-input]').clear().type(newTitle);
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-title]').contains(newTitle);
  });

  it('can edit a published resource, but license and access is disabled', () => {
    const publishedTestPost = mockMyResources[0];
    const newTitle = 'new title';
    cy.get('[data-testid=my-resources-link]').click();
    cy.get(`[data-testid=edit-resource-button-${publishedTestPost.identifier}]`).click();
    cy.get('[data-testid=dlr-title-input]').clear().type(newTitle);

    cy.get('[data-testid=resource-published-warning]').should('exist');

    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=contains-other-peoples-work-option-no].Mui-disabled').should('exist');
    cy.get('[data-testid=contains-other-peoples-work-option-yes].Mui-disabled').should('exist');
    cy.get('[data-testid=resource-restriction-option-CC_BY_4_0].Mui-disabled').should('exist');
    cy.get('[data-testid=resource-restriction-option-ntnu-internt].Mui-disabled').should('exist');

    cy.get('[data-testid=licence-field] .MuiInputBase-root.Mui-disabled').should('exist');
    cy.get('[data-testid=access-dropdown-menu] .MuiInputBase-root.Mui-disabled').should('exist');

    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-title]').contains(newTitle);
    cy.get('[data-testid=resource-publish-button]').should('not.exist');
  });
});
