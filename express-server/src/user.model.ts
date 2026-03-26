import { HttpError } from "./utils/http-error";

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,50}$/;

const ensureObject = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  return value as Record<string, unknown>;
};

const parseRequiredString = (
  value: unknown,
  fieldName: string,
  maxLength: number,
  pattern?: RegExp,
): string => {
  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string.`);
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new HttpError(400, `${fieldName} is required.`);
  }

  if (normalizedValue.length > maxLength) {
    throw new HttpError(400, `${fieldName} must be ${maxLength} characters or fewer.`);
  }

  if (pattern && !pattern.test(normalizedValue)) {
    throw new HttpError(400, `${fieldName} is invalid.`);
  }

  return normalizedValue;
};

export const parseUserId = (value: string): number => {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new HttpError(400, "User id must be a positive integer.");
  }

  return parsedValue;
};

const parseUserInput = (payload: unknown): CreateUserInput => {
  const body = ensureObject(payload);

  return {
    username: parseRequiredString(body.username, "username", 50, USERNAME_REGEX),
    firstName: parseRequiredString(body.firstName, "firstName", 100),
    lastName: parseRequiredString(body.lastName, "lastName", 100),
    email: parseRequiredString(body.email, "email", 255, EMAIL_REGEX).toLowerCase(),
  };
};

export const validateCreateUserInput = (payload: unknown): CreateUserInput => parseUserInput(payload);

export const validateUpdateUserInput = (payload: unknown): UpdateUserInput => parseUserInput(payload);
