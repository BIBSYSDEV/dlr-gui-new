context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('starts a registration', () => {
    cy.get('[data-testid=new-registration-link]').click();
  });
});
