export const PASSWORD_RULES = [
  {
    label: 'At least 6 characters',
    valid: (value: string) => value && value.length >= 6,
  },
  {
    label: 'Must contain an uppercase letter',
    valid: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: 'Must contain a lowercase letter',
    valid: (value: string) => /[a-z]/.test(value),
  },
  {
    label: 'Must contain a number',
    valid: (value: string) => /\d/.test(value),
  },
  {
    label: 'Must contain a special character',
    valid: (value: string) => /[!@#$%^&*]/.test(value),
  },
];
