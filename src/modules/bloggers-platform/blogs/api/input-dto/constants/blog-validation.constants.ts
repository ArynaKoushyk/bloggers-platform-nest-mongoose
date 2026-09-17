export const blogNameConstraints = {
  minLength: 1,
  maxLength: 15,
};

export const blogDescriptionConstraints = {
  minLength: 1,
  maxLength: 500,
};

export const blogWebsiteUrlConstraints = {
  minLength: 1,
  maxLength: 100,
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};
