import { SearchParameters } from '../../../src/types/search.types';

context('Action', () => {
  const search = 'bananas';
  const tag1 = 'digital';

  beforeEach(() => {
    cy.visit('/');
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
    const tag2_search = 'dig';
    const tag2 = 'digital læringsressurs';
    const tag2_encoded = 'digital+l%C3%A6ringsressurs';
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

  it('Can add and remove the same tag several times', () => {
    const tag1 = 'digital';
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tags-input] input`).type(tag1);
    cy.get(`#filter-tags-input-popup`).should('exist');
    cy.get(`#filter-tags-input-popup li:first-of-type`).click();
    cy.get(`[data-testid=filter-tag-chip-0]`).should('exist');
    cy.get(`[data-testid=tag-filter-delete-${tag1}]`).click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tag-chip-0]`).should('not.exist');
    cy.get(`[data-testid=filter-tags-input] input`).type(tag1);
    cy.get(`#filter-tags-input-popup li:first-of-type`).click();
    cy.get(`[data-testid=filter-tag-chip-0]`).should('exist');
  });
});
