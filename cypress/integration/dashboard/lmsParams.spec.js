import { LMSParametersName } from '../../../src/types/LMSParameters';
import { SearchParameters } from '../../../src/types/search.types';
import { mockCreators } from '../../../src/api/mockdata';

context('LMS params', () => {
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

  it('renders a back button instead of a navigation bar for certain pages', () => {
    cy.visit('/?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('not.exist');
    cy.get(`[data-testid=navigation-bar]`).should('not.exist');
    cy.visit('/resource/1234?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/admin?navbar=true');
    cy.get(`[data-testid=navigation-back-button]`).should('not.exist');
    cy.visit('/resource/12344/content/main?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('not.exist');
    cy.visit('/resources/12344/content/main?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('not.exist');
    cy.visit('/resources/1234?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/handlenotfound?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/resources/user/current?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/resources/user/current?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/admin?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/profile?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/privacy-policy?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/registration?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/editresource/1234?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/worklist?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/forbidden?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/search-helper?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
    cy.visit('/sitemap?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).should('exist');
  });

  it('uses the back button correctly', () => {
    cy.visit('/resources/1234?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/');
      expect(loc.search).to.eq('?navbar=false');
    });
    cy.visit('/editresource/1234?navbar=false');
    cy.get(`[data-testid=navigation-back-button]`).click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/resources/user/current');
      expect(loc.search).to.eq('?navbar=false');
    });
  });
});
