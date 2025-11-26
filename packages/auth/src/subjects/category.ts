import {z} from 'zod';
import { categorySchema } from '../models/category';

export const categorySubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.union([z.literal('Category'), categorySchema]),
]);
export type CategorySubject = z.infer<typeof categorySubject>;
