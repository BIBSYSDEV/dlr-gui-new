context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('adds search term to url', () => {
    const search = 'bananas';
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}`);
    });
  });
});
