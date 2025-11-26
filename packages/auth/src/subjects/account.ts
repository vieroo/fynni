import {z} from 'zod';
import { accountSchema } from '../models/account';

export const accountSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.union([z.literal('Account'), accountSchema]),
]);
export type AccountSubject = z.infer<typeof accountSubject>;
