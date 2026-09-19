export const registrationLoginConstraints = {
  minLength: 3,
  maxLength: 10,
  match: /^[a-zA-Z0-9_-]*$/,
};

export const registrationPasswordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const registrationEmailConstraints = {
  match: /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
};
