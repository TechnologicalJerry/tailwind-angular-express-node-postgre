import { DatabaseError } from "pg";
import { db } from "../db.config";
import { CreateUserInput, UpdateUserInput, User } from "../user.model";
import { HttpError } from "../utils/http-error";

interface UserRow {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

const mapUser = (row: UserRow): User => ({
  id: row.id,
  username: row.username,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

const isUniqueViolation = (error: unknown): error is DatabaseError => {
  return error instanceof DatabaseError && error.code === "23505";
};

export const listUsers = async (): Promise<User[]> => {
  const result = await db.query<UserRow>(
    `
      SELECT id, username, first_name, last_name, email, created_at, updated_at
      FROM users
      ORDER BY id ASC
    `,
  );

  return result.rows.map(mapUser);
};

export const getUserById = async (userId: number): Promise<User> => {
  const result = await db.query<UserRow>(
    `
      SELECT id, username, first_name, last_name, email, created_at, updated_at
      FROM users
      WHERE id = $1
    `,
    [userId],
  );

  const user = result.rows[0];

  if (!user) {
    throw new HttpError(404, `User ${userId} was not found.`);
  }

  return mapUser(user);
};

export const createUser = async (payload: CreateUserInput): Promise<User> => {
  try {
    const result = await db.query<UserRow>(
      `
        INSERT INTO users (username, first_name, last_name, email)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, first_name, last_name, email, created_at, updated_at
      `,
      [payload.username, payload.firstName, payload.lastName, payload.email],
    );

    return mapUser(result.rows[0]);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new HttpError(409, "A user with that username or email already exists.");
    }

    throw error;
  }
};

export const updateUser = async (userId: number, payload: UpdateUserInput): Promise<User> => {
  try {
    const result = await db.query<UserRow>(
      `
        UPDATE users
        SET username = $1,
            first_name = $2,
            last_name = $3,
            email = $4,
            updated_at = NOW()
        WHERE id = $5
        RETURNING id, username, first_name, last_name, email, created_at, updated_at
      `,
      [payload.username, payload.firstName, payload.lastName, payload.email, userId],
    );

    const updatedUser = result.rows[0];

    if (!updatedUser) {
      throw new HttpError(404, `User ${userId} was not found.`);
    }

    return mapUser(updatedUser);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new HttpError(409, "A user with that username or email already exists.");
    }

    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  const result = await db.query<{ id: number }>(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `,
    [userId],
  );

  if (result.rowCount === 0) {
    throw new HttpError(404, `User ${userId} was not found.`);
  }
};