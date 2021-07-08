context('Handle not found', () => {
  it('renders a handle not found page', () => {
    cy.visit('/handlenotfound');
    cy.get(`[data-testid=404]`).contains('404');
  });
});
