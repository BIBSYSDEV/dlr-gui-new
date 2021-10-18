import {
  mockContents,
  mockContributors,
  mockCreators,
  mockLicenses,
  mockMyResources,
  mockResource,
  mockResourceStatistics,
  mockTags,
  mockText,
} from '../../src/api/mockdata';
import { SearchParameters } from '../../src/types/search.types';
import { resourcePath } from '../../src/utils/constants';

context('Resource', () => {
  beforeEach(() => {
    cy.visit(`${resourcePath}/mock-id`);
  });

  it('can preview a text file', () => {
    cy.get('[data-testid=text-file-content-typography').contains(mockText);
  });

  it('shows a resources data', () => {
    cy.get('[data-testid=resource-title]').contains(mockResource.features.dlr_title);
    cy.get('[data-testid=resource-contributors]').contains(mockContributors[0].features.dlr_contributor_name);
    cy.get('[data-testid=resource-creators]').contains(mockCreators[0].features.dlr_creator_name);
    cy.get('[data-testid=resource-description]').contains(mockResource.features.dlr_description);
    cy.get('[data-testid=resource-time-created]').contains('01.11.2020');
    cy.get('[data-testid=resource-time-published]').contains('06.11.2020');
    cy.get('[data-testid=resource-tags]').contains(mockTags[0]);
    cy.get('[data-testid=resource-license]').contains(mockLicenses[0].features.dlr_license_code.replace(' 4.0', ''));
  });

  it('can show views', () => {
    cy.get('[data-testid=resource-views]').contains(mockResourceStatistics.features.dlr_statistics_delivery_count);
  });

  it('shows a resources content', () => {
    const masterMockContent = mockContents[0];
    cy.get(`[data-testid=file-content-${masterMockContent.identifier}-download-button]`).should('exist');
    cy.get(`[data-testid=file-content-${masterMockContent.identifier}-content]`).contains(
      masterMockContent.features.dlr_content
    );
    cy.get(`[data-testid=file-content-${masterMockContent.identifier}-size]`).contains(
      masterMockContent.features.dlr_content_size
    );
    const additionalMockContent = mockContents[2];
    cy.get(`[data-testid=file-content-${additionalMockContent.identifier}-download-button]`).should('exist');
    cy.get(`[data-testid=file-content-${additionalMockContent.identifier}-content]`).contains(
      additionalMockContent.features.dlr_content_title
    );
    cy.get(`[data-testid=file-content-${additionalMockContent.identifier}-size]`).contains(
      additionalMockContent.features.dlr_content_size
    );
  });

  it('can click on tags to open a search ', () => {
    const tag0_encoded = 'mock%20tag1';
    cy.get('[data-testid=tag-chip-0]').click();
    cy.get('[data-testid=filter-tag-chip-0]').should('exist');
    cy.location().should((loc) => {
      expect(loc.search).to.eq(`?${SearchParameters.tag}=${tag0_encoded}`);
    });
  });

  it('shows edit-button if user is resource owner, admin, curator or editor', () => {
    const publishedTestPost = mockMyResources[0];
    const newTitle = 'A new title';

    cy.visit(`${resourcePath}/${mockMyResources[1].identifier}]`);
    cy.get('[data-testid=edit-resource-button').should('not.exist');

    cy.visit(`${resourcePath}/${publishedTestPost.identifier}]`);
    cy.get('[data-testid=edit-resource-button').click();
    cy.get('[data-testid=step-navigation-0]').click();
    cy.get('[data-testid=dlr-title-input]').clear().type(newTitle);
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-title]').contains(newTitle);
  });

  it('can report a resource', () => {
    cy.get('[data-testid=report-resource-button').click();
    cy.get('[data-testid=report-dialog]').should('exist');
    cy.get(`[data-testid=report-dialog-submit-button]`).should('be.disabled');
    cy.get('[data-testid=report-dialog-input]').type('some text');

    cy.get('[data-testid=report-dialog-cancel-button]').click();
    cy.get('[data-testid=report-dialog]').should('not.exist');

    cy.get('[data-testid=report-resource-button').click();
    cy.get('[data-testid=report-dialog-input]').type('some new text');
    cy.get('[data-testid=report-dialog-submit-button]').click();
    cy.get('[data-testid=report-dialog]').should('not.exist');
  });

  it('is possible to request DOI', () => {
    const publishedTestPost = mockMyResources[0];
    cy.visit(`${resourcePath}/${publishedTestPost.identifier}]`);
    cy.get('[data-testid=request-doi-button').click();
    cy.get(`[data-testid=doi-dialog-submit-button]`).should('be.disabled');
    cy.get('[data-testid=doi-dialog-input]').type('some text');
    cy.get('[data-testid=doi-dialog-cancel-button]').click();
    cy.get('[data-testid=doi-dialog]').should('not.exist');
    cy.get('[data-testid=request-doi-button').click();
    cy.get('[data-testid=doi-dialog-input]').type('some text');
    cy.get(`[data-testid=doi-dialog-submit-button]`).click();
    cy.get('[data-testid=doi-dialog]').should('not.exist');
    cy.get('[data-testid=request-sent-info]').should('exist');
  });

  it('renders creator search result list', () => {
    cy.get(`[data-testid=also-published-by-header-${mockCreators[0].identifier}`)
      .contains(mockCreators[0].features.dlr_creator_name)
      .click();
    cy.get(`[data-testid=creator-published-item-${mockCreators[0].identifier}`).should('have.length', 5);
    cy.get(`[data-testid=show-all-posts-${mockCreators[0].identifier}`).click();

    cy.location().should((loc) => {
      expect(loc.search).to.eq(
        `?${SearchParameters.creator}=Creator%20Creatorson&${SearchParameters.creator}=Creatorson,%20Creator`
      );
    });
  });
  it('is possible to request ownership change', () => {
    cy.get('[data-testid=request-ownership-button').click();
    cy.get('[data-testid=ownership-dialog-input]').type('some text');
    cy.get('[data-testid=ownership-dialog-submit-button').click();
    cy.get('[data-testid=request-sent-info]').should('exist');
  });

  it('does not show extremely long list of tags, unless user clicks on show more', () => {
    cy.get('[data-testid=tag-chip-9]').should('not.exist');
    cy.get('[data-testid=show-all-tags]').click();
    cy.get('[data-testid=tag-chip-9]').should('exist');
  });

  it("is not possible to request DOI for other people's resources", () => {
    cy.visit(`${resourcePath}/${mockMyResources[1].identifier}`);
    cy.get('[data-testid=request-doi-button').should('not.exist');
    cy.visit(`${resourcePath}/${mockMyResources[0].identifier}`);
    cy.get('[data-testid=request-doi-button').should('exist');
  });
});
