context('Actions', () => {
  const search = 'bananas';
  const ntnu = 'ntnu';
  const bi = 'bi';
  const oslomet = 'oslomet';

  it('adds search term to url', () => {
    cy.visit('/');
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}`);
    });
  });
  it('adds an institution as a filter', () => {
    cy.visit('/');
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}&inst=${ntnu}`);
    });
  });
  it('adds several institution as a filter', () => {
    cy.visit('/');
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${bi}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${oslomet}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}&inst=%28${ntnu}+OR+${bi}+OR+${oslomet}%29`);
    });
  });
  it('can remove one or all institutions filters', () => {
    cy.visit('/');
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${bi}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${oslomet}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}&inst=%28${bi}+OR+${oslomet}%29`);
    });
    cy.get(`[data-testid=institution-filtering-checkbox-label-${bi}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}&inst=${oslomet}`);
    });
    cy.get(`[data-testid=institution-filtering-checkbox-label-${oslomet}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}`);
    });
  });
  it('can detect institution filters in the url', () => {
    cy.visit(`/?query=${search}&inst=%28${ntnu}+OR+${oslomet}%29`);
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-${ntnu}]`)
      .children('span')
      .children('input')
      .should('be.checked');
    cy.get(`[data-testid=institution-filtering-checkbox-${oslomet}]`)
      .children('span')
      .children('input')
      .should('be.checked');
    cy.get(`[data-testid=institution-filtering-checkbox-${bi}]`)
      .children('span')
      .children('input')
      .should('not.be.checked');
  });
});
