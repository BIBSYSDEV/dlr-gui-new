import {
  mockContent,
  mockContents,
  mockDefaultResource,
  mockKalturaPresentations,
  mockMyResources,
} from '../../src/api/mockdata';
import { licenses } from '../../src/utils/testfiles/licenses';
import { ResourceFeatureTypes } from '../../src/types/resource.types';
import { resourcePath } from '../../src/utils/constants';

context('Registration', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('starts a registration with a link', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=dlr-title-input]').should('have.value', mockDefaultResource.features.dlr_title);
    cy.get('[data-testid=tag-chip-0]').contains(mockDefaultResource.tags[0]);
    cy.get('[data-testid=resource-type-input] input').should('have.value', ResourceFeatureTypes.document);
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
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();

    const mockTitle = 'Mocktitle';
    const mockDescription = 'MockDescription';
    cy.get('[data-testid=dlr-title-input]').clear().type(mockTitle);
    cy.get('[data-testid=dlr-description-input]').type(mockDescription);
    cy.get('[data-testid=resource-type-input]').click();
    cy.get('[data-testid=resource-type-option-simulation]').click();
    cy.get('[data-testid=resource-type-input] input').should('have.value', ResourceFeatureTypes.simulation);

    //contributors
    cy.get('[data-testid=next-step-button]').click();
    //contents
    cy.get('[data-testid=next-step-button]').click();
    //licenses
    cy.get('[data-testid=next-step-button]').click();
    cy.get('[data-testid=contains-other-peoples-work-option-no] input').click();
    cy.get('[data-testid=licence-field]').click();
    cy.get(`[data-testid=license-option-${licenses[0].identifier}`).click();
    //preview
    cy.get('[data-testid=next-step-button]').click();
    cy.get('[data-testid=resource-title]').contains(mockTitle);
    cy.get('[data-testid=resource-description]').contains(mockDescription);
    cy.get('[data-testid=resource-publish-button]').click();
    cy.url().should('include', `${resourcePath}/${mockDefaultResource.identifier}`);
  });

  it('Changes first letter to uppercase for title, description and creatorname', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();

    const mockTitle = 'mocktitle';
    const mockTitleFirstLetterUpperCase = 'Mocktitle';
    const mockDescription = 'mockDescription';
    const mockDescriptionFirstLetterUpperCase = 'MockDescription';
    const mockCreator = 'mockCreator';
    const mockCreatorFirstLetterUpperCase = 'MockCreator';
    cy.get('[data-testid=dlr-title-input]').clear().type(mockTitle);
    cy.get('[data-testid=dlr-description-input]').type(mockDescription);

    //creators
    cy.get('[data-testid=step-navigation-1]').click();
    cy.get('[data-testid=creator-name-field-0]').clear().type(mockCreator);

    //preview

    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-title]').contains(mockTitleFirstLetterUpperCase);
    cy.get('[data-testid=resource-description]').contains(mockDescriptionFirstLetterUpperCase);
    cy.get('[data-testid=resource-creators]').contains(mockCreatorFirstLetterUpperCase);
  });

  it('runs a minimal registration with errors', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=dlr-title-input]').clear();
    //preview
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-publish-button]').should('be.disabled');
    cy.get('[data-testid=form-errors-panel]').should('exist');
    cy.get('[data-testid=step-navigation-0] .Mui-error').should('exist');
    cy.get('[data-testid=step-navigation-1] .Mui-error').should('not.exist');
    cy.get('[data-testid=step-navigation-2] .Mui-error').should('not.exist');
    cy.get('[data-testid=step-navigation-3] .Mui-error').should('exist');
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
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos NTNU');
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
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos NTNU');
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
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos NTNU');
    cy.get('[data-testid=add-private-consumer-access-button]').click();
    cy.get('[data-testid=add-institution-consumer-access]').click({ force: true });
    cy.get('[data-testid=private-consumer-access-chip-2]').should('not.exist');
    cy.get('[data-testid=delete-private-consumer-access-chip-1]').click();
    cy.get('[data-testid=private-consumer-access-chip-1]').should('not.exist');
    cy.get('[data-testid=add-private-consumer-access-button]').click();
    cy.get('[data-testid=add-institution-consumer-access]').click();
    cy.get('[data-testid=private-consumer-access-chip-1]').contains('Alle hos NTNU');
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

  it('uses licenseWizard', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();

    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=licence-field] input').should('have.value', '');

    cy.get('[data-testid=resource-restriction-option-ntnu-internt] input').click();
    cy.get('[data-testid=licence-field] input').should('have.value', 'd56b161e-05d0-45c9-b96b-5c0b37b952b4');
    cy.get('[data-testid=licence-field]').contains('ntnu-internt');
    cy.get('[data-testid=access-dropdown-menu] input').should('have.value', 'private');

    cy.get('[data-testid=resource-restriction-option-yes] input').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC-ND');
    cy.get('[data-testid=resource-restriction-option-CC_BY_4_0] input').click();
    cy.get('[data-testid=licence-field]').contains('CC BY');
    cy.get('[data-testid=resource-restriction-option-yes] input').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-NC-ND');

    cy.get('[data-testid=commercial-use-option-yes] input').click();
    cy.get('[data-testid=licence-field]').contains('CC BY');
    cy.get('[data-testid=commercial-use-option-NC] input').click();
    cy.get('[data-testid=licence-field]').contains('NC');
    cy.get('[data-testid=commercial-use-radio-group] .Mui-checked').should('exist');

    cy.get('[data-testid=modify-and-build-option-primary_yes] input').click();
    cy.get('[data-testid=licence-field]').should('not.contain', 'ND');
    cy.get('[data-testid=modify-and-build-option-share_alike] input').click();
    cy.get('[data-testid=licence-field]').contains('SA');
    cy.get('[data-testid=modify-and-build-option-ND] input').click();
    cy.get('[data-testid=licence-field]').contains('ND');

    //hide commercial and modifyAndBuild when selecting no restriction
    cy.get('[data-testid=resource-restriction-option-CC_BY_4_0] input').click();
    cy.get('[data-testid=modify-and-build-radio-group]').should('not.exist');
    cy.get('[data-testid=commercial-use-radio-group]').should('not.exist');

    //reopen commercial and modifyAndBuild but empty checkboxes when reselecting restrictions
    cy.get('[data-testid=resource-restriction-option-yes] input').click();
    cy.get('[data-testid=modify-and-build-radio-group]').should('exist');
    cy.get('[data-testid=commercial-use-radio-group]').should('exist');
    cy.get('[data-testid=commercial-use-radio-group] .Mui-checked').should('not.exist');
  });

  it('uses otherPeoplesWorkWizard', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    cy.get('[data-testid=step-navigation-3]').click();

    cy.get('[data-testid=contains-other-peoples-work-radio-group] .Mui-checked').should('not.exist');
    cy.get('[data-testid=usage-cleared-with-owner-option-radio-group]').should('not.exist');
    cy.get('[data-testid=usage-cleared-with-owner-info]').should('not.exist');

    cy.get('[data-testid=contains-other-peoples-work-option-yes] input').click();
    cy.get('[data-testid=usage-cleared-with-owner-radio-group]').should('exist');

    cy.get('[data-testid=usage-cleared-with-owner-option-creative_commons] input').click();
    cy.get('[data-testid=usage-cleared-with-owner-info]').should('exist');
    cy.get('[data-testid=access-dropdown-menu] input').should('have.value', 'open');
    cy.get('[data-testid=usage-cleared-with-owner-option-no_clearance]').click();
    cy.get('[data-testid=usage-cleared-with-owner-info]').should('exist');
    cy.get('[data-testid=access-dropdown-menu] input').should('have.value', 'private');
  });

  it('adds and removes contributors', () => {
    const unpublishedTestPost = mockMyResources[1];
    cy.visit(`/editresource/${unpublishedTestPost.identifier}]`);
    const mockContributor1 = 'Mock Contributor1';
    const mockContributor2 = 'Mock Contributor2';
    cy.get('[data-testid=step-navigation-1]').click();
    //add
    cy.get('[data-testid=contributor-add-button]').click();
    cy.get('[data-testid=contributor-type-field-1]').click();
    cy.get('[data-testid=contributor-type-options-4]').click();
    cy.get('[data-testid=contributor-name-field-1]').type(mockContributor1).type('{enter}');
    //add and delete
    cy.get('[data-testid=contributor-add-button]').click();
    cy.get('[data-testid=contributor-type-field-2]').click();
    cy.get('[data-testid=contributor-type-options-2]').click();
    cy.get('[data-testid=contributor-name-field-2]').type(mockContributor2).type('{enter}');
    cy.get('[data-testid=contributor-delete-button-2]').click();
    //test preview
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-contributors]').should('contain', mockContributor1);
    cy.get('[data-testid=resource-contributors]').should('not.contain', mockContributor2);
  });

  it('adds and removes creators', () => {
    const unpublishedTestPost = mockMyResources[1];
    cy.visit(`/editresource/${unpublishedTestPost.identifier}]`);
    const mockCreator1 = 'Mock Creator1';
    const mockCreator2 = 'Mock Creator2';
    cy.get('[data-testid=step-navigation-1]').click();
    //add
    cy.get('[data-testid=creator-add-button]').click();
    cy.get('[data-testid=creator-name-field-2]').type(mockCreator1).type('{enter}');
    //add and delete
    cy.get('[data-testid=creator-add-button]').click();
    cy.get('[data-testid=creator-name-field-3]').type(mockCreator2).type('{enter}');
    cy.get('[data-testid=creator-delete-button-3]').click();
    //test preview
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-creators]').should('contain', mockCreator1);
    cy.get('[data-testid=resource-creators]').should('not.contain', mockCreator2);
  });

  it('starts a registration with a file', () => {
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-file]').click();
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });
    cy.get('input[type=file]:first-of-type').uploadFile('testPicture.png');
    cy.get('[data-testid=step-navigation-2').click();
    cy.get(`[data-testid=thumbnail-${mockDefaultResource.identifier}]`).should('exist');
    cy.get(`[data-testid=master-content-title]`).should('have.value', mockContents[0].features.dlr_content);
    cy.get('.uppy-StatusBar.is-complete').should('exist');
  });

  it('register keyword tags', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();
    const testTag1 = 'tag1';
    const testTag2 = 'one more tag';
    const testTag3 = 'tag3';
    const testTag4SearchTerm = 'digital';
    const testTag4 = 'digital læring';
    cy.get('[data-testid=resource-tags-input]').type(`${testTag1}{enter}`);
    cy.get('[data-testid=resource-tags-input]').type(`${testTag2}{enter}`);
    cy.get('[data-testid=resource-tags-input]').type(`${testTag3}{enter}`);
    cy.get('[data-testid=tag-chip-0]').contains(testTag1);
    cy.get('[data-testid=tag-chip-0] .MuiChip-deleteIcon').click();
    cy.get('[data-testid=tag-chip-0]').should('not.contain', testTag1);
    cy.get('[data-testid=tag-chip-4]').should('not.exist');

    cy.get(`[data-testid=resource-tags-input] input`).type(testTag4SearchTerm);
    cy.get(`#register-tags-input-option-1`).click(); //as results are hard coded
    cy.get(`[data-testid=tag-chip-3]`).contains(testTag4);

    //tag exist on preview
    cy.get('[data-testid=step-navigation-4]').click();
    cy.get('[data-testid=resource-tags]').should('contain', testTag2);
    cy.get('[data-testid=resource-tags]').should('contain', testTag3);
    cy.get('[data-testid=resource-tags]').should('contain', testTag4);
  });

  it('register additional files', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();

    cy.get('[data-testid=step-navigation-2]').click();
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });
    cy.get('[data-testid=additional-files-uppy-dashboard] input[type=file]:first-of-type').uploadFile(
      'testPicture.png'
    );
    cy.get(`[data-testid=additional-file-content-${mockContent.identifier}]`).contains(
      mockContent.features.dlr_content
    );
    cy.get(`[data-testid=thumbnail-${mockContent.identifier}]`).should('exist');
    cy.get(`[data-testid=additional-file-${mockContent.identifier}-delete-button]`).click();
    cy.get(`[data-testid=thumbnail-${mockContent.identifier}]`).should('not.exist');
  });

  it('register thumbnail', () => {
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-file]').click();
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });
    cy.get('input[type=file]:first-of-type').uploadFile('testPicture.png');
    cy.get('[data-testid=step-navigation-2').click();
    cy.get('[data-testid=step-navigation-2]').click();
    cy.get(`[data-testid=change-master-content-thumbnail-button]`).click();
    cy.get(`[data-testid=upload-new-thumbnail-button]`).click();
    cy.get('input[type=file]:first-of-type').uploadFile('textFile.txt'); //uploading not-images file should fail
    cy.get('input[type=file]:first-of-type').should('exist');
    cy.get('input[type=file]:first-of-type').uploadFile('testPicture.png');

    cy.get(`[data-testid=change-master-content-thumbnail-button]`).click();
    cy.get(`[data-testid=revert-thumbnail-button]`).click();
  });

  it('lets the uesr know if their license matches the licenseWizard recommendation or not', () => {
    const testLink = 'http://www.test.com';
    cy.get('[data-testid=new-registration-link]').click();
    cy.get('[data-testid=new-resource-link]').click();
    cy.get('[data-testid=new-resource-link-input]').type(testLink);
    cy.get('[data-testid=new-resource-link-submit-button]').click();

    cy.get('[data-testid=step-navigation-3]').click();
    cy.get('[data-testid=contains-other-peoples-work-option-no] input').click();
    cy.get('[data-testid=resource-restriction-option-yes] input').click();
    cy.get('[data-testid=commercial-use-option-yes] input').click();
    cy.get('[data-testid=modify-and-build-option-share_alike] input').click();
    cy.get('[data-testid=licence-field]').contains('CC BY-SA');
    cy.get('[data-testid=recommended-license]').contains(
      'Anbefalt lisens basert på valgene i dette skjemaet stemmer overens med valgt lisens'
    );
    cy.get('[data-testid=licence-field]').click();
    cy.get(`[data-testid=license-option-${licenses[0].identifier}`).click();
    cy.get('[data-testid=recommended-license]').contains(
      'Anbefalt lisens basert på dine valg i dette skjemaet er CC BY-SA'
    );
  });

  it('starts a registration with a Kaltura video', () => {
    cy.visit('/registration/?useKalturaFeature=true'); //TODO: remove once ready for prod
    cy.get('[data-testid=new-resource-kaltura]').click();
    cy.get('[data-testid=open-kaltura-dialog-button]').click();
    cy.get(`[data-testid=use-kaltura-link-button-${mockKalturaPresentations[0].id}]`).click();
    cy.get('[data-testid=dlr-title-input]').should('have.value', mockKalturaPresentations[0].title);
    cy.get('[data-testid=resource-type-input] input').should('have.value', ResourceFeatureTypes.video);
  });

  it('can use pagination on Kaltura-list', () => {
    cy.visit('/registration/?useKalturaFeature=true'); //TODO: remove once ready for prod
    cy.get('[data-testid=new-resource-kaltura]').click();
    cy.get('[data-testid=open-kaltura-dialog-button]').click();
    cy.get(`[data-testid=kaltura-item-${mockKalturaPresentations[0].id}]`).should('exist');
    cy.get(`[data-testid=kaltura-item-${mockKalturaPresentations[10].id}]`).should('not.exist');
    cy.get(`[data-testid=kaltura-pagination] li:last-of-type button`).click(); //next page
    cy.get(`[data-testid=kaltura-item-${mockKalturaPresentations[10].id}]`).should('exist');
  });
});
