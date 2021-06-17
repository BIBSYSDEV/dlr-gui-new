import { mockUser } from '../../src/api/mockdata';

context('Action', () => {
  beforeEach(() => {
    cy.visit(`/profile`);
  });
  it('displays user metadata', () => {
    cy.get(`[data-testid=profile-name]`).contains(mockUser.name);
  });
});
