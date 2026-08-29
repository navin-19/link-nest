/**
 * Canonical Default Customer Fields and Form Configuration
 */

export const DEFAULT_CUSTOMER_FIELDS = [
  {
    id: 'full_name',
    key: 'name',
    label: 'Full Name',
    placeholder: 'Jane Doe',
    type: 'text',
    enabled: true,
    required: true,
    isSystem: true,
  },
  {
    id: 'email',
    key: 'email',
    label: 'Email Address',
    placeholder: 'jane@example.com',
    type: 'email',
    enabled: true,
    required: true,
    isSystem: true,
  },
  {
    id: 'mobile',
    key: 'mobile_number',
    label: 'Mobile / WhatsApp Number',
    placeholder: '98765 43210',
    type: 'phone',
    enabled: true,
    required: true,
    isSystem: true,
  },
  {
    id: 'place',
    key: 'place',
    label: 'Place / City',
    placeholder: 'e.g. New York, London, Mumbai',
    type: 'text',
    enabled: true,
    required: false,
    isSystem: true,
  },
  {
    id: 'address',
    key: 'address',
    label: 'Street Address',
    placeholder: 'Street address, apartment, or delivery details...',
    type: 'textarea',
    enabled: false,
    required: false,
    isSystem: true,
  },
  {
    id: 'company',
    key: 'company',
    label: 'Company Name',
    placeholder: 'Acme Corp',
    type: 'text',
    enabled: false,
    required: false,
    isSystem: false,
  },
  {
    id: 'dob',
    key: 'dob',
    label: 'Date of Birth',
    placeholder: 'YYYY-MM-DD',
    type: 'date',
    enabled: false,
    required: false,
    isSystem: false,
  },
  {
    id: 'gender',
    key: 'gender',
    label: 'Gender',
    placeholder: 'Select gender',
    type: 'dropdown',
    options: ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
    enabled: false,
    required: false,
    isSystem: false,
  },
  {
    id: 'website',
    key: 'website',
    label: 'Website / Portfolio',
    placeholder: 'https://example.com',
    type: 'text',
    enabled: false,
    required: false,
    isSystem: false,
  },
];

export const DEFAULT_CUSTOMER_FORM_CONFIG = {
  enabled: true,
  title: 'Stay Connected',
  description: 'Get updates, offers, and important announcements.',
  submitButtonText: 'Subscribe & Connect',
  successMessage: 'Thank you! Your contact details have been shared.',
  fields: DEFAULT_CUSTOMER_FIELDS,
};

/**
 * Resolves customer form config with robust fallbacks for newly added fields.
 */
export function resolveCustomerFormConfig(savedConfig) {
  if (!savedConfig || typeof savedConfig !== 'object') {
    return { ...DEFAULT_CUSTOMER_FORM_CONFIG };
  }

  const enabled = savedConfig.enabled !== false;
  const title = savedConfig.title || DEFAULT_CUSTOMER_FORM_CONFIG.title;
  const description =
    savedConfig.description !== undefined
      ? savedConfig.description
      : DEFAULT_CUSTOMER_FORM_CONFIG.description;
  const submitButtonText =
    savedConfig.submitButtonText || DEFAULT_CUSTOMER_FORM_CONFIG.submitButtonText;
  const successMessage =
    savedConfig.successMessage || DEFAULT_CUSTOMER_FORM_CONFIG.successMessage;

  let fields = Array.isArray(savedConfig.fields) ? savedConfig.fields : [];

  if (fields.length === 0) {
    fields = [...DEFAULT_CUSTOMER_FIELDS];
  } else {
    // Merge any missing default fields if not present
    const existingIds = new Set(fields.map((f) => f.id || f.key));
    const missingDefaults = DEFAULT_CUSTOMER_FIELDS.filter(
      (df) => !existingIds.has(df.id) && !existingIds.has(df.key)
    );
    fields = [...fields, ...missingDefaults];
  }

  return {
    enabled,
    title,
    description,
    submitButtonText,
    successMessage,
    fields,
  };
}
