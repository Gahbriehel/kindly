import * as yup from "yup";

// Mirrors the backend's password rules for reset and change password.
export const PASSWORD_RULES_HINT =
  "At least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character.";

export const newPasswordSchema = yup
  .string()
  .required("Enter a new password")
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-z]/, "Password must contain a lowercase letter")
  .matches(/[A-Z]/, "Password must contain an uppercase letter")
  .matches(/\d/, "Password must contain a number")
  .matches(/[^A-Za-z0-9]/, "Password must contain a special character");

export function confirmPasswordSchema(field = "newPassword") {
  return yup
    .string()
    .required("Confirm your new password")
    .oneOf([yup.ref(field)], "Passwords do not match");
}
