context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can delete a resource', () => {
    cy.get('[data-testid=my-resources-link]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=delete-my-resources-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('exist');
    cy.get('[data-testid=delete-confirm-dialog-confirm-button-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=list-item-resources-123]').should('not.exist');
  });

  it('can start deleting, then aborting deletion by clicking on abort button', () => {
    cy.get('[data-testid=my-resources-link]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=delete-my-resources-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('exist');
    cy.get('[data-testid=delete-confirm-dialog-abort-button-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=list-item-resources-123]').should('exist');
  });

  it('can start deleting, then aborting deletion by clicking outside the confirm-delete dialog', () => {
    cy.get('[data-testid=my-resources-link]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=delete-my-resources-123]').click();
    cy.get('[data-testid=delete-confirm-dialog]').should('exist');
    cy.get('[data-testid=delete-confirm-dialog]').click(0, 0);
    cy.get('[data-testid=delete-confirm-dialog]').should('not.exist');
    cy.get('[data-testid=list-item-resources-123]').should('exist');
  });
});
