context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('starts a registration with a link', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click({ force: true });
    cy.get('[data-testid=dlr_title-input]').should('have.value', 'This is a mocked generated title');
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

  it('uses licenseWizard', () => {
    cy.visit('/editresource/123');
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
