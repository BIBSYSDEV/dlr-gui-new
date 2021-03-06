import i18n from '../../translations/i18n';

export const ErrorMessage = {
  REQUIRED: i18n.t('resource:feedback.required_field'),
  MISSING_CONTRIBUTOR: i18n.t('resource:feedback.minimum_one_contributor'),
  MISSING_FILE: i18n.t('resource:feedback.minimum_one_file'),
  INVALID_PAGE_INTERVAL: i18n.t('resource:feedback.invalid_page_interval'),
  INVALID_FORMAT: i18n.t('resource:feedback.invalid_format'),
  INVALID_ISBN: i18n.t('resource:feedback.invalid_isbn'),
  MUST_BE_FUTURE: i18n.t('resource:feedback.date_must_be_in_future'),
  MUST_BE_POSITIVE: i18n.t('resource:feedback.must_be_positive'),
  MUST_BE_MIN_1: i18n.t('resource:feedback.must_be_min_1'),
};
