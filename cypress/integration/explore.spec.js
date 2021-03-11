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
      expect(loc.search).to.eq(`?query=${search}&inst=${ntnu}&inst=${bi}&inst=${oslomet}`);
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
      expect(loc.search).to.eq(`?query=${search}&inst=${bi}&inst=${oslomet}`);
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
    cy.visit(`/?query=${search}&inst=${ntnu}&inst=${oslomet}`);
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

  //TODO use constants for parameters frmo other PR
  it('adds and remove tags as a filters', () => {
    cy.visit('/');
    const tag1 = 'tag1';
    const tag2 = 'tag2';
    const tag3 = 'fjksf dlfsd';
    const tag3_encoded = 'fjksf%20dlfsd';
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tags-input] input`).type(tag1 + '{enter}');
    cy.get(`[data-testid=filter-tags-input] input`).should('have.value', '');
    cy.get(`[data-testid=filter-tags-input] input`).type(tag2 + '{enter}');
    cy.get(`[data-testid=filter-tags-input] input`).type(tag3 + '{enter}');
    cy.get(`[data-testid=filter-tag-chip-0]`).contains(tag1);
    cy.get(`[data-testid=filter-tag-chip-1]`).contains(tag2);
    cy.get(`[data-testid=filter-tag-container]`).contains(tag3);
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}&tag=${tag1}&tag=${tag2}&tag=${tag3_encoded}`);
    });
    cy.get(`[data-testid=filter-tag-chip-0] .MuiChip-deleteIcon`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}&tag=${tag2}&tag=${tag3_encoded}`);
    });
    cy.get(`[data-testid=filter-tag-chip-0]`).contains(tag2);
    cy.get(`[data-testid=filter-tag-chip-0] .MuiChip-deleteIcon`).click();
    cy.get(`[data-testid=filter-tag-chip-0] .MuiChip-deleteIcon`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?query=${search}`);
    });
  });

  it('can detect tag filters in the url', () => {
    const tag1 = 'tag1';
    const tag2 = 'tag2';
    const tag3 = 'fjksf dlfsd';
    const tag3_encoded = 'fjksf%20dlfsd';
    cy.visit(`/?query=${search}&tag=${tag1}&tag=${tag2}&tag=${tag3_encoded}`);
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tag-container]`).contains(tag1);
    cy.get(`[data-testid=filter-tag-chip-1]`).contains(tag2);
    cy.get(`[data-testid=filter-tag-chip-2]`).contains(tag3);
  });
});
