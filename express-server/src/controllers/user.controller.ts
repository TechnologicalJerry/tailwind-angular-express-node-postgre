import { Request, Response } from "express";
import { parseUserId, validateCreateUserInput, validateUpdateUserInput } from "../user.model";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from "../services/user.service";

export const getUsersHandler = async (_request: Request, response: Response): Promise<void> => {
  const users = await listUsers();
  response.status(200).json({ data: users });
};

export const getUserHandler = async (request: Request, response: Response): Promise<void> => {
  const userId = parseUserId(request.params.userId);
  const user = await getUserById(userId);
  response.status(200).json({ data: user });
};

export const createUserHandler = async (request: Request, response: Response): Promise<void> => {
  const payload = validateCreateUserInput(request.body);
  const user = await createUser(payload);
  response.status(201).json({ data: user });
};

export const updateUserHandler = async (request: Request, response: Response): Promise<void> => {
  const userId = parseUserId(request.params.userId);
  const payload = validateUpdateUserInput(request.body);
  const user = await updateUser(userId, payload);
  response.status(200).json({ data: user });
};

export const deleteUserHandler = async (request: Request, response: Response): Promise<void> => {
  const userId = parseUserId(request.params.userId);
  await deleteUser(userId);
  response.status(204).send();
};