import { SearchParameters } from '../../../src/types/search.types';
import { ResourceFeatureTypes } from '../../../src/types/resource.types';

context('Actions', () => {
  const search = 'bananas';
  const ntnu = 'ntnu';
  const bi = 'bi';
  const oslomet = 'oslomet';
  const license1 = 'CC BY 4.0';
  const license1Short = 'CCBY40';
  const license2 = 'CC BY-ND 4.0';
  const license2Short = 'CCBY-ND40';
  const license3Short = 'CCBY-SA40';

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
    cy.get(`[data-testid=institution-filtering-checkbox-${ntnu}] input`).should('be.checked');
    cy.get(`[data-testid=institution-filtering-checkbox-${oslomet}] input`).should('be.checked');
    cy.get(`[data-testid=institution-filtering-checkbox-${bi}] input`).should('not.be.checked');
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
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-${ResourceFeatureTypes.audio.toString().toLowerCase()}] input`
    ).should('be.checked');
    cy.get(
      `[data-testid=resource-type-filtering-checkbox-${ResourceFeatureTypes.video.toString().toLowerCase()}] input`
    ).should('be.checked');
  });

  it('adds and remove license as a filters', () => {
    const license1 = 'CC BY 4.0';
    const license1Short = 'CCBY40';
    const license2 = 'CC BY-ND 4.0';
    const license2Short = 'CCBY-ND40';
    const license3 = 'CC BY-SA 4.0';
    const license3Short = 'CCBY-SA40';

    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license1Short}]`).click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license2Short}]`).click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license3Short}]`).click();
    cy.location().should((loc) => {
      const searchParams = new URLSearchParams();
      searchParams.set(SearchParameters.query, search);
      searchParams.append(SearchParameters.license, license1);
      searchParams.append(SearchParameters.license, license2);
      searchParams.append(SearchParameters.license, license3);
      expect(loc.search).to.eq(`?${searchParams.toString()}`);
    });
    cy.get(`[data-testid=license-filtering-checkbox-label-${license1Short}]`).click();
    cy.location().should((loc) => {
      const searchParams = new URLSearchParams();
      searchParams.set(SearchParameters.query, search);
      searchParams.delete(SearchParameters.license);
      searchParams.append(SearchParameters.license, license2);
      searchParams.append(SearchParameters.license, license3);
      expect(loc.search).to.eq(`?${searchParams.toString()}`);
    });
    cy.get(`[data-testid=license-filtering-checkbox-label-${license2Short}]`).click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license3Short}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}`);
    });
  });

  it('can detect license filters in the url', () => {
    cy.visit(
      `/?${SearchParameters.query}=${search}&${SearchParameters.license}=${encodeURI(license1)}&${
        SearchParameters.license
      }=${encodeURI(license2)}`
    );
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=license-filtering-checkbox-${license1Short}] input`).should('be.checked');
    cy.get(`[data-testid=license-filtering-checkbox-${license2Short}] input`).should('be.checked');
    cy.get(`[data-testid=license-filtering-checkbox-${license3Short}] input`).should('not.be.checked');
  });

  it('can detect showInaccessible filter in the url', () => {
    cy.visit(`/?${SearchParameters.query}=${search}&${SearchParameters.showInaccessible}=true`);
    cy.get(`[data-testid=access-filtering-checkbox] input`).should('be.checked');
  });

  it('can add showInaccessible filter in the url', () => {
    cy.visit(`/?${SearchParameters.query}=${search}`);
    cy.get(`[data-testid=access-checkbox-label] input`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}&${SearchParameters.showInaccessible}=true`);
    });
  });
});
