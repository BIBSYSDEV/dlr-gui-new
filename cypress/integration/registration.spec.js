context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('starts a registration with a link', () => {
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type('http://www.test.com');
    cy.get('[data-testid=new-resource-link-submit-button]').click({ force: true });
    cy.get('[data-testid=dlr_title-input]').should('have.value', 'This is a mocked generated title');
  });

  it('starts a registration - invalid url', () => {
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type('test.com');
    cy.get('[data-testid=new-resource-link-submit-button]').click({ force: true });
    cy.get('[data-testid=new-resource-link-submit-button]').should('be.disabled');
    cy.get('[data-testid=new-resource-link-input-wrapper] p.Mui-error').should('be.visible'); //får ikke lagt inn  data-testid på <errormessage>
  });
});
