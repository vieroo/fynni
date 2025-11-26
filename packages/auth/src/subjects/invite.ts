import { z } from 'zod';

export const inviteSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('accept'),
    z.literal('reject'),
    z.literal('manage'),
  ]),
  z.literal('Invite'),
]);
export type InviteSubject = z.infer<typeof inviteSubject>;
