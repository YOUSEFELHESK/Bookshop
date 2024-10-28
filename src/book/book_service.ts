import { db } from "../utlils/db.server";
import type { Author } from "../author/author_service";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

type BookRead = {
  id: number;
  title: string;
  datePublished: Date;
  isFiction: boolean;
  author: Author;
  //   authorId: number;
};

type BookWrite = {
  title: string;
  datePublished: Date;
  authorId: number;
  isFiction: boolean;
};

export const listBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books: BookRead[] = await db.book.findMany({
      select: {
        id: true,
        title: true,
        datePublished: true,
        isFiction: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.status(200).json(books);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const book = await db.book.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        title: true,
        datePublished: true,
        isFiction: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const createBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, datePublished, isFiction, authorId } = req.body;
  const parsedDate: Date = new Date(datePublished);
  if (!title || !datePublished || !authorId) {
    console.log({ title, parsedDate, isFiction, authorId, datePublished });
  }
  try {
    const newBook = await db.book.create({
      data: {
        title, // تأكد من أن هذا الحقل موجود في req.body
        datePublished: parsedDate, // تأكد من أن هذا الحقل موجود في req.body ويُرسل بشكل صحيح
        isFiction, // تأكد من أن هذا الحقل موجود ويُرسل بشكل صحيح
        author: {
          connect: { id: authorId }, // استخدم connect لربط الكتاب بالمؤلف
        },
      },
      select: {
        id: true,
        title: true,
        datePublished: true,
        isFiction: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json(newBook);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, datePublished, isFiction, authorId } = req.body;
  const parsedDate: Date = new Date(datePublished);
  console.log({ title, parsedDate, isFiction, authorId, datePublished });
  try {
    const updatedBook = await db.book.update({
      where: { id: Number(id) },
      data: { title, datePublished: parsedDate, isFiction, authorId },
      select: {
        id: true,
        title: true,
        datePublished: true,
        isFiction: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.status(200).json(updatedBook);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await db.book.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // No Content
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

//The style if the man i was following the course with:

// export const listBooks = async (): Promise<BookRead[]> => {
//   return db.book.findMany({
//     select: {
//       id: true,
//       title: true,
//       datePublished: true,
//       isFiction: true,
//       author: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//         },
//       },
//       //   authorId: true,
//     },
//   });
// };

// export const getBook = async (id: number): Promise<BookRead | null> => {
//   return db.book.findUnique({
//     where: {
//       id,
//     },
//     select: {
//       id: true,
//       title: true,
//       isFiction: true,
//       datePublished: true,
//       author: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//         },
//       },
//     },
//   });
// };

// export const createBook = async (book: BookWrite): Promise<BookRead> => {
//   const { title, authorId, datePublished, isFiction } = book;
//   const parsedDate: Date = new Date(datePublished);

//   return db.book.create({
//     data: {
//       title,
//       authorId,
//       isFiction,
//       datePublished: parsedDate,
//     },
//     select: {
//       id: true,
//       title: true,
//       isFiction: true,
//       datePublished: true,
//       author: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//         },
//       },
//     },
//   });
// };

// export const updateBook = async (
//   book: BookWrite,
//   id: number
// ): Promise<BookRead> => {
//   const { title, isFiction, datePublished, authorId } = book;
//   return db.book.update({
//     where: {
//       id,
//     },
//     data: {
//       title,
//       isFiction,
//       datePublished,
//       authorId,
//     },
//     select: {
//       id: true,
//       title: true,
//       isFiction: true,
//       datePublished: true,
//       author: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//         },
//       },
//     },
//   });
// };

// export const deleteBook = async (id: number): Promise<void> => {
//   await db.book.delete({
//     where: {
//       id,
//     },
//   });
// };
