import { mockUser } from '../../src/api/mockdata';

context('Action', () => {
  beforeEach(() => {
    cy.visit(`/profile`);
  });
  it('displays user metadata', () => {
    cy.get(`[data-testid=profile-name]`).contains(mockUser.name);
    cy.get(`[data-testid=profile-id]`).contains(mockUser.id);
    cy.get(`[data-testid=profile-email]`).contains(mockUser.email);
    cy.get(`[data-testid=profile-institution]`).contains(mockUser.institution.toUpperCase());
    cy.get(`[data-testid=role-admin]`).should('exist');
    cy.get(`[data-testid=role-curator]`).should('exist');
    cy.get(`[data-testid=role-editor]`).should('exist');
    cy.get(`[data-testid=role-publisher]`).should('exist');
    cy.get(`[data-testid=role-read-only]`).should('not.exist');
  });

  it('displays groups', () => {
    const subject1 = 'ACIT4015 2021 Vår';
    const subject2 = 'ACIT4050 2021 Vår';
    const subject3 = 'ACIT4090 2021 Vår';
    cy.get(`[data-testid=profile-group-0]`).contains(subject1);
    cy.get(`[data-testid=profile-group-1]`).contains(subject2);
    cy.get(`[data-testid=profile-group-2]`).contains(subject3);
  });
});
