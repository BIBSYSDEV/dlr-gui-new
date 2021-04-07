context('Actions', () => {
  beforeEach(() => {
    cy.visit(`/resource/mock-id`);
  });

  it('is for curator users possible to add authorities', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-1]').click();
    cy.get('[data-testid=authority-link-button]').should('not.exist');
    cy.get('[data-testid=verify-authority-button]').first().click();
    cy.get('[data-testid=add-verify-authority-1214]').should('exist');
    cy.get('[data-testid=add-verify-authority-213]').click();
    cy.get('[data-testid=add-verify-authority-213]').should('be.disabled');
    cy.get('[data-testid=add-verify-authority-1214]').should('not.exist');
    cy.get('[data-testid=authority-selector-close-button]').click();
    cy.get('[data-testid=authority-link-button]').should('exist');
  });
});
