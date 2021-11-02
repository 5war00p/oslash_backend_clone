/* All global variables that used in entire API are intialized here */

// Regexp to check email
export const EMAIL_REGEXP = /\S+@\S+\.\S+/;

// Loose Object i.e., a key can be assigned of any data type
export interface LooseObject {
  [key: string]: any;
}
