import { Book } from "@prisma/client";
import { db } from "../utlils/db.server";
import type { Request, Response } from "express";

export type Author = {
  id: number;
  firstName: string;
  lastName: string;
};

export const listAuthors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authors: Author[] = await db.author.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    res.status(200).json(authors);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const getAuthor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const author = await db.author.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const createAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName } = req.body;
  try {
    const newauthor = await db.author.create({
      data: {
        firstName,
        lastName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
    res.status(201).json(newauthor);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const updateAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName } = req.body;
  const { id } = req.params;
  try {
    const updateauhtor = await db.author.update({
      where: {
        id: Number(id),
      },
      data: {
        firstName,
        lastName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
    res.status(200).json(updateauhtor); // No Content
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const deleteAuthor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await db.author.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(204).send(); // No Content
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
