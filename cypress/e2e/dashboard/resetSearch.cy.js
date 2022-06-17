import { SearchParameters } from '../../../src/types/search.types';
import { ResourceFeatureTypes } from '../../../src/types/resource.types';

context('Reset search', () => {
  const search = 'bananas';
  const ntnu = 'ntnu';
  const license1 = 'CC BY 4.0';
  const license1Short = 'CCBY40';
  const tag1 = 'digital';
  const initialUrl = `/?${SearchParameters.query}=${search}&${SearchParameters.page}=3`;

  beforeEach(() => {
    cy.visit(initialUrl);
  });

  it('removes page-parameter from url when applying showInaccessible-filter', () => {
    //showInaccessible
    cy.get(`[data-testid=access-checkbox-label] input`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}&${SearchParameters.showInaccessible}=true`);
    });
  });

  it('removes page-parameter from url when applying license-filter', () => {
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=license-filtering-checkbox-${license1Short}] input`).click();
    cy.location().should((loc) => {
      const searchParams = new URLSearchParams();
      searchParams.set(SearchParameters.query, search);
      searchParams.set(SearchParameters.license, license1);
      expect(loc.search).to.eq(`?${searchParams.toString()}`);
    });
  });

  it('removes page-parameter from url when applying tag-filter', () => {
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tags-input] input`).type(tag1);
    cy.get(`#filter-tags-input-option-0`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}&${SearchParameters.tag}=${tag1}`);
    });
  });

  it('removes page-parameter from url when applying institution-filter', () => {
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=institution-filtering-checkbox-label-${ntnu}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}&${SearchParameters.institution}=${ntnu}`);
    });
  });

  it('removes page-parameter from url when applying type-filter', () => {
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-label-${ResourceFeatureTypes.audio.toString().toLowerCase()}]`
    ).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.resourceType}=${ResourceFeatureTypes.audio}`
      );
    });
  });
  it('removes page-parameter from url when a new search is initiated', () => {
    cy.get('[data-testid=search-for-resource-input] input').clear().type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}`);
    });
  });
});
