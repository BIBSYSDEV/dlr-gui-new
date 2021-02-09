import { mockCalculatedResource, mockMyResources } from '../../src/api/mockdata';
import { licenses } from '../../src/utils/testfiles/licenses';

const testLink = 'http://www.test.com';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('starts a registration with a link', () => {
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=dlr-title-input]').should('have.value', mockCalculatedResource.features.dlr_title);
    cy.get('[data-testid=step-navigation-2').click();
    cy.get('[data-testid=content-step-link]').contains(testLink);
  });

  it('starts a registration - invalid url', () => {
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type('test.com');
    cy.get('[data-testid=new-resource-link-submit-button]').click({ force: true });
    cy.get('[data-testid=new-resource-link-submit-button]').should('be.disabled');
    cy.get('[data-testid=new-resource-link-input-wrapper] p.Mui-error').should('be.visible'); //får ikke lagt inn  data-testid på <errormessage>
  });

  it('runs a minimal registration and publishes', () => {
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();

    const mockTitle = 'mocktitle';
    const mockDescription = 'mockDescription';
    cy.get('[data-testid=dlr-title-input]').clear().type(mockTitle);
    cy.get('[data-testid=dlr-description-input]').type(mockDescription);
    //contributors
    cy.get('[data-testid=next-step-button]').click();
    //contents
    cy.get('[data-testid=next-step-button]').click();
    //licenses
    cy.get('[data-testid=next-step-button]').click();
    cy.get('[data-testid=contains_other_peoples_work_option_no]').click();
    cy.get('[data-testid=licence-field]').click();
    cy.get(`[data-testid=license_option_${licenses[0].identifier}`).click();
    //preview
    cy.get('[data-testid=next-step-button]').click();
    cy.get('[data-testid=resource-title]').contains(mockTitle);
    cy.get('[data-testid=resource-description]').contains(mockDescription);
    cy.get('[data-testid=publish-button]').click();
    cy.url().should('include', `/resource/${mockCalculatedResource.identifier}`);
  });

  it('uses licenseWizard', () => {
    const unpublishedTestPost = mockMyResources[1];
    cy.visit(`/editresource/${unpublishedTestPost.identifier}]`);

    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY 4.0');

    cy.get('[data-testid=resource_restriction_option_ntnu-internt]').click();
    cy.get('[data-testid=licence-field]').contains('ntnu-internt');
    cy.get('[data-testid=resource_restriction_option_yes]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC-ND 4.0');
    cy.get('[data-testid=resource_restriction_option_CC_BY_4_0]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY 4.0');
    cy.get('[data-testid=resource_restriction_option_yes]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC-ND 4.0');

    cy.get('[data-testid=commercial_use_option_yes]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY 4.0');
    cy.get('[data-testid=commercial_use_option_NC]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC 4.0');
    cy.get('[data-testid=commercial_use_radio_group] .Mui-checked').should('exist');

    cy.get('[data-testid=modify_and_build_option_primary_yes]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC 4.0');
    cy.get('[data-testid=modify_and_build_option_share_alike]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC-SA 4.0');
    cy.get('[data-testid=modify_and_build_option_ND]').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC-ND 4.0');

    //hide commercial and modifyAndBuild when selecting no restriction
    cy.get('[data-testid=resource_restriction_option_CC_BY_4_0]').click();
    cy.get('[data-testid=modify_and_build_radio_group]').should('not.exist');
    cy.get('[data-testid=commercial_use_radio_group]').should('not.exist');

    //reopen commercial and modifyAndBuild but empty checkboxes when reselecting restrictions
    cy.get('[data-testid=resource_restriction_option_yes]').click();
    cy.get('[data-testid=modify_and_build_radio_group]').should('exist');
    cy.get('[data-testid=commercial_use_radio_group]').should('exist');
    cy.get('[data-testid=commercial_use_radio_group] .Mui-checked').should('not.exist');
  });
});
