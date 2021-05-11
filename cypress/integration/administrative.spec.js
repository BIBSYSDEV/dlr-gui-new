import { mockAdminList, mockCuratorList, mockEditorList, mockMyResources } from '../../src/api/mockdata';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can se a list of administrators, curators and editors', () => {
    cy.get('[data-testid=admin-link]').click();
    cy.get(`[data-testid=administrator-list]`).contains(mockAdminList[1]);
    cy.get(`[data-testid=editor-list]`).contains(mockEditorList[0]);
    cy.get(`[data-testid=curator-list]`).contains(mockCuratorList[2]);
  });
});
