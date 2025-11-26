import {z} from 'zod';
import { organizationMemberSchema } from '../models/organization-member';

export const organizationMemberSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.union([z.literal('OrganizationMember'), organizationMemberSchema]),
]);
export type OrganizationMemberSubject = z.infer<typeof organizationMemberSubject>;
