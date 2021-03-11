import { SearchParameters } from '../../src/types/search.types';
import { ResourceFeatureTypes } from '../../src/types/resource.types';

context('Actions', () => {
  const search = 'bananas';
  const ntnu = 'ntnu';
  const bi = 'bi';
  const oslomet = 'oslomet';

  beforeEach(() => {
    cy.visit('/');
  });

  it('adds search term to url', () => {
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}`);
    });
  });

  it('adds an institution as a filter', () => {
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}&${SearchParameters.institution}=${ntnu}`);
    });
  });

  it('adds several institution as a filter', () => {
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${bi}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${oslomet}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.institution}=${ntnu}&${SearchParameters.institution}=${bi}&${SearchParameters.institution}=${oslomet}`
      );
    });
  });

  it('can remove one or all institutions filters', () => {
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${bi}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${oslomet}]`).click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.institution}=${bi}&${SearchParameters.institution}=${oslomet}`
      );
    });
    cy.get(`[data-testid=institution-filtering-checkbox-label-${bi}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}&${SearchParameters.institution}=${oslomet}`);
    });
    cy.get(`[data-testid=institution-filtering-checkbox-label-${oslomet}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}`);
    });
  });

  it('can detect institution filters in the url', () => {
    cy.visit(
      `/?${SearchParameters.query}=${search}&${SearchParameters.institution}=${ntnu}&${SearchParameters.institution}=${oslomet}`
    );
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

  it('adds file types as a filter', () => {
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.audio.toString().toLowerCase()}]`
    ).click();
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.video.toString().toLowerCase()}]`
    ).click();
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.document.toString().toLowerCase()}]`
    ).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.resourceType}=${ResourceFeatureTypes.audio}&${SearchParameters.resourceType}=${ResourceFeatureTypes.video}&${SearchParameters.resourceType}=${ResourceFeatureTypes.document}`
      );
    });
  });

  it('can remove one or all resource types filters', () => {
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.audio.toString().toLowerCase()}]`
    ).click();
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.video.toString().toLowerCase()}]`
    ).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.resourceType}=${ResourceFeatureTypes.audio}&${SearchParameters.resourceType}=${ResourceFeatureTypes.video}`
      );
    });
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.audio.toString().toLowerCase()}]`
    ).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.resourceType}=${ResourceFeatureTypes.video}`
      );
    });
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.video.toString().toLowerCase()}]`
    ).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}`);
    });
  });

  it('can detect file types filters in the url', () => {
    cy.visit(
      `/?${SearchParameters.query}=${search}&${SearchParameters.resourceType}=${ResourceFeatureTypes.audio}&${SearchParameters.resourceType}=${ResourceFeatureTypes.video}`
    );
    cy.get(`[data-testid=resource-type-filtering-checkbox-${ResourceFeatureTypes.audio.toString().toLowerCase()}]`)
      .children('span')
      .children('input')
      .should('be.checked');
    cy.get(`[data-testid=resource-type-filtering-checkbox-${ResourceFeatureTypes.video.toString().toLowerCase()}]`)
      .children('span')
      .children('input')
      .should('be.checked');
  });
});
