// Inspired by: https://github.com/cypress-io/cypress/issues/170#issuecomment-533519550
Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fileName) => {
  cy.fixture(fileName).then((content) => {
    const el = subject[0];
    const testFile = new File([content], fileName);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(testFile);
    el.files = dataTransfer.files;
    cy.wrap(subject).first().trigger('change', { force: true });
  });
});
