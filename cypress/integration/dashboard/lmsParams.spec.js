import { LMSParametersName } from '../../../src/types/LMSParameters';
import { SearchParameters } from '../../../src/types/search.types';
import { mockCreators } from '../../../src/api/mockdata';

context('Actions', () => {
  const search = 'bananas';
  const tag1 = 'digital';

  beforeEach(() => {
    cy.visit(`/?${LMSParametersName.BBShowEmbedButton}=true`);
  });

  it('retains LMS params in the URL after applying new search filters', () => {
    const tag1UnComplete = 'digi';
    cy.get('[data-testid=search-for-resource-input]').type(search);
    cy.get('[data-testid=search-for-resource-submit]').click();
    cy.get('[data-testid=expand-filtering-options]').click();
    cy.get(`[data-testid=filter-tags-input] input`).type(tag1UnComplete);
    cy.get(`#filter-tags-input-popup li:first-of-type`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${LMSParametersName.BBShowEmbedButton}=true&${SearchParameters.query}=${search}&${SearchParameters.tag}=${tag1}`
      );
    });
  });

  it('retains LMS params in the URL after navigating to a resource', () => {
    cy.get('[data-testid=link-to-resource-2ee4177a-06ca-4883-8343-16670fad3e1a]').click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${LMSParametersName.BBShowEmbedButton}=true`);
    });
  });

  it('retains LMS params in the URL after clicking on the creator has also published link', () => {
    cy.visit(`/resources/123?${LMSParametersName.BBShowEmbedButton}=true`);
    cy.get(`[data-testid=also-published-by-header-${mockCreators[0].identifier}`).click();
    cy.get(`[data-testid=show-all-posts-${mockCreators[0].identifier}`).click();
    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.creator}=Creator%20Creatorson&${SearchParameters.creator}=Creatorson,%20Creator&${LMSParametersName.BBShowEmbedButton}=true`
      );
    });
  });
});
