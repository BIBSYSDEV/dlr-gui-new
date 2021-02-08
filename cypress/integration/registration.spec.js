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

  it('registers institution when selecting private access', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=access-dropdown-menu]').click();
    cy.get('[data-testid=access-dropdown-menu-option-private]').click();
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos ntnu');
  });

  it('is possible to delete private access chips', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=access-dropdown-menu]').click();
    cy.get('[data-testid=access-dropdown-menu-option-private]').click();
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos ntnu');
    cy.get('[data-testid=delete-private-consumer-access-chip-1]').click().should('not.exist');
  });

  it('is possible to register institution manually as private access and no duplicates are created', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=access-dropdown-menu]').click();
    cy.get('[data-testid=access-dropdown-menu-option-private]').click();
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos ntnu');
    cy.get('[data-testid=add-private-consumer-access-button]').click();
    cy.get('[data-testid=add-institution-consumer-access]').click({ force: true });
    cy.get('[data-testid=private-consumer-access-chip-2]').should('not.exist');
    cy.get('[data-testid=delete-private-consumer-access-chip-1]').click();
    cy.get('[data-testid=private-consumer-access-chip-1]').should('not.exist');
    cy.get('[data-testid=add-private-consumer-access-button]').click();
    cy.get('[data-testid=add-institution-consumer-access]').click();
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos ntnu');
  });

  it('is possible to register a list of emails, invalid emails remains in the input field', () => {
    const testLink = 'http://www.test.com';
    const emailList = 'epost@epost.no, epost2@epost.no ajfaskdfj, epost@asdf.no{enter}';
    const invalidEmail = 'ajfaskdfj';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=access-dropdown-menu]').click();
    cy.get('[data-testid=access-dropdown-menu-option-private]').click();
    cy.get('[data-testid=add-private-consumer-access-button]').click();
    cy.get('[data-testid=add-person-consumer-access]').click();
    cy.get('[data-testid=feide-id-input]').type(emailList).contains(invalidEmail);
    cy.get('[data-testid=private-consumer-access-chip-2]').should('exist');
    cy.get('[data-testid=private-consumer-access-chip-3]').should('exist');
    cy.get('[data-testid=private-consumer-access-chip-4]').should('exist');
    cy.get('[data-testid=private-consumer-access-chip-5]').should('not.exist');
  });

  it('does not add duplicate emails when adding private person access', () => {
    const testLink = 'http://www.test.com';
    const emailList = 'epost@epost.no, epost@epost.no {enter}';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=access-dropdown-menu]').click();
    cy.get('[data-testid=access-dropdown-menu-option-private]').click();
    cy.get('[data-testid=add-private-consumer-access-button]').click();
    cy.get('[data-testid=add-person-consumer-access]').click();
    cy.get('[data-testid=feide-id-input]').type(emailList);
    cy.get('[data-testid=private-consumer-access-chip-2]').should('exist');
    cy.get('[data-testid=private-consumer-access-chip-3]').should('not.exist');
    cy.get('[data-testid=feide-id-input]').type(emailList);
    cy.get('[data-testid=private-consumer-access-chip-3]').should('not.exist');
  });

  it('is possible to add courses private consumer access', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=access-dropdown-menu]').click();
    cy.get('[data-testid=access-dropdown-menu-option-private]').click();
    cy.get('[data-testid=add-private-consumer-access-button]').click();
    cy.get('[data-testid=add-course-consumer-access]').click();
    cy.get('[data-testid=course-input]').click().type('{downarrow}{enter}');
    cy.get('[data-testid=confirm-adding-access]').click();
    cy.get('[data-testid=private-consumer-access-chip-2]').should('exist');
  });
});
