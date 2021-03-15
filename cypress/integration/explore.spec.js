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
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.tag}=${tag1}&${SearchParameters.tag}=${tag2}&${SearchParameters.tag}=${tag3_encoded}`
      );
    });
    cy.get(`[data-testid=filter-tag-chip-0] .MuiChip-deleteIcon`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.tag}=${tag2}&${SearchParameters.tag}=${tag3_encoded}`
      );
    });
    cy.get(`[data-testid=filter-tag-chip-0]`).contains(tag2);
    cy.get(`[data-testid=filter-tag-chip-0] .MuiChip-deleteIcon`).click();
    cy.get(`[data-testid=filter-tag-chip-0] .MuiChip-deleteIcon`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}`);
    });
  });

  it('can detect tag filters in the url', () => {
    const tag1 = 'tag1';
    const tag2 = 'tag2';
    const tag3 = 'fjksf dlfsd';
    const tag3_encoded = 'fjksf%20dlfsd';
    cy.visit(
      `/?${SearchParameters.query}=${search}&${SearchParameters.tag}=${tag1}&${SearchParameters.tag}=${tag2}&${SearchParameters.tag}=${tag3_encoded},`
    );
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tag-container]`).contains(tag1);
    cy.get(`[data-testid=filter-tag-chip-1]`).contains(tag2);
    cy.get(`[data-testid=filter-tag-chip-2]`).contains(tag3);
  });
});
