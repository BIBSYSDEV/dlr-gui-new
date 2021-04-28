import {
  mockContributors,
  mockCreators,
  mockLicenses,
  mockMyResources,
  mockResource,
  mockTags,
} from '../../src/api/mockdata';

context('Actions', () => {
  beforeEach(() => {
    cy.visit(`/resource/mock-id`);
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
