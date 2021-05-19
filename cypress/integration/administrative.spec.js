import { mockAdminList, mockCuratorList, mockEditorList, mockMyResources } from '../../src/api/mockdata';
import { InstitutionProfilesNames } from '../../src/types/user.types';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can see a list of administrators, curators and editors', () => {
    cy.get('[data-testid=admin-link]').click();
    cy.get(`[data-testid=administrator-list]`).contains(mockAdminList[1]);
    cy.get(`[data-testid=editor-list]`).contains(mockEditorList[0]);
    cy.get(`[data-testid=curator-list]`).contains(mockCuratorList[2]);
  });

  it('can search for a institution user and set/remove roles', () => {
    cy.get('[data-testid=admin-link]').click();
    cy.get(`[data-testid=inst-user-search-button]`).should('be.disabled');
    cy.get(`[data-testid=inst-user-search-input]`).type('afkds');
    cy.get(`[data-testid=inst-user-search-button]`).should('be.disabled');
    cy.get(`[data-testid=inst-user-search-input]`).type('@test.com');

    cy.get(`[data-testid=inst-user-search-button]`).click();
    cy.get(`[data-testid=inst-user-card]`).should('exist');
    cy.get(`[data-testid=inst-user-roles-saved]`).should('not.exist');

    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.editor}-switch].Mui-checked`).should('exist');
    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.editor}-switch]`).click();
    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.editor}-switch].Mui-checked`).should('not.exist');

    cy.get(`[data-testid=inst-user-roles-saved]`).should('exist');

    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.administrator}-switch].Mui-checked`).should('not.exist');
    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.administrator}-switch]`).click();
    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.administrator}-switch].Mui-checked`).should('exist');

    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.curator}-switch]`).click();
    cy.get(`[data-testid=inst-user-${InstitutionProfilesNames.publisher}-switch]`).click();
  });
});
