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

  it('can search for tags and select from dropdown(popover)', () => {
    cy.visit('/');
    const singleCharacter = 'd';
    const tag1 = 'igi';
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tags-input] input`).type(singleCharacter);
    cy.get(`#filter-tags-input-popup`).should('not.exist');
    cy.get(`[data-testid=filter-tags-input] input`).type(tag1);
    cy.get(`#filter-tags-input-popup`).should('exist');
    cy.get(`#filter-tags-input-popup li:first-of-type`).click();
    cy.get(`[data-testid=filter-tag-chip-0]`).should('exist');
  });

  it('adds and remove tags as a filters', () => {
    cy.visit('/');
    const tag1 = 'digital';
    const tag2_search = 'jalla';
    const tag2 = 'digital læringsressurs';
    const tag2_encoded = 'digital%20l%C3%A6ringsressurs';
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();

    cy.get(`[data-testid=filter-tags-input] input`).type(tag1);
    cy.get(`#filter-tags-input-option-0`).click(); //as results are hard coded
    cy.get(`[data-testid=filter-tag-chip-0]`).should('exist');

    cy.get(`[data-testid=filter-tags-input] input`).type(tag2_search);
    cy.get(`#filter-tags-input-option-2`).click(); //as results are hard coded
    cy.get(`[data-testid=filter-tag-chip-1]`).should('exist');

    cy.get(`[data-testid=filter-tag-chip-0]`).contains(tag1);
    cy.get(`[data-testid=filter-tag-chip-1]`).contains(tag2);
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.tag}=${tag1}&${SearchParameters.tag}=${tag2_encoded}`
      );
    });
    cy.get(`[data-testid=filter-tag-chip-0] .MuiChip-deleteIcon`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}&${SearchParameters.tag}=${tag2_encoded}`);
    });
    cy.get(`[data-testid=filter-tag-chip-0]`).contains(tag2);
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

  it('adds and remove license as a filters', () => {
    const license1 = 'CC BY 4.0';
    const license1Short = 'CCBY40';
    const license2 = 'bi-opphaver-bi';
    const license3 = 'CC BY-SA 4.0';
    const license3Short = 'CCBY-SA40';
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license1Short}]`).click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license2}]`).click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license3Short}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.license}=${encodeURI(license1)}&${
          SearchParameters.license
        }=${encodeURI(license2)}&${SearchParameters.license}=${encodeURI(license3)}`
      );
    });
    cy.get(`[data-testid=license-filtering-checkbox-label-${license1Short}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.query}=${search}&${SearchParameters.license}=${encodeURI(license2)}&${
          SearchParameters.license
        }=${encodeURI(license3)}`
      );
    });
    cy.get(`[data-testid=license-filtering-checkbox-label-${license2}]`).click();
    cy.get(`[data-testid=license-filtering-checkbox-label-${license3Short}]`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.query}=${search}`);
    });
  });

  it('can detect license filters in the url', () => {
    const license1 = 'CC BY 4.0';
    const license1Short = 'CCBY40';
    const license2 = 'bi-opphaver-bi';
    const license3Short = 'CCBY-SA40';
    cy.visit(
      `/?${SearchParameters.query}=${search}&${SearchParameters.license}=${encodeURI(license1)}&${
        SearchParameters.license
      }=${encodeURI(license2)}`
    );
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=license-filtering-checkbox-${license1Short}] input`).should('be.checked');
    cy.get(`[data-testid=license-filtering-checkbox-${license2}] input`).should('be.checked');
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
