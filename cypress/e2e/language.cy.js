context('Language', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('can change language', () => {
    cy.get(`[data-testid=language-button]`).click();
    cy.get(`[data-testid=nb-no-button]`).click();
    cy.get(`[data-testid=page-title]`).contains('Utforsk');
    cy.get(`[data-testid=language-button]`).click();
    cy.get(`[data-testid=eng-button]`).click();
    cy.get(`[data-testid=page-title]`).contains('Explore');
  });
});
