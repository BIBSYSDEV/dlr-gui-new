import {
  mockContents,
  mockContributors,
  mockCreators,
  mockLicenses,
  mockMyResources,
  mockResource,
  mockTags,
  mockText,
} from '../../src/api/mockdata';
import { SearchParameters } from '../../src/types/search.types';

context('Actions', () => {
  beforeEach(() => {
    cy.visit(`/resource/mock-id`);
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
    cy.get('[data-testid=resource-license]').contains(mockLicenses[0].features.dlr_license_code);
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
      additionalMockContent.features.dlr_content
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

  it('shows edit-button', () => {
    const publishedTestPost = mockMyResources[0];
    const unpublishedTestPost = mockMyResources[1];
    const newTitle = 'a new title';

    cy.visit(`/resource/${unpublishedTestPost.identifier}]`);
    cy.get('[data-testid=edit-resource-button').click();
    cy.get('[data-testid=step-navigation-0]').click();
    cy.get('[data-testid=dlr-title-input]').clear().type(newTitle);
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-title]').contains(newTitle);

    cy.visit(`/resource/${publishedTestPost.identifier}]`);
    cy.get('[data-testid=edit-resource-button').click();
    cy.get('[data-testid=step-navigation-0]').click();
    cy.get('[data-testid=dlr-title-input]').clear().type(newTitle);
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-title]').contains(newTitle);
  });
});
