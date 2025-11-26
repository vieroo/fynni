import {
  createMongoAbility,
  type CreateAbility,
  type MongoAbility,
  AbilityBuilder,
} from '@casl/ability';

import { z } from 'zod';
import { userSubject } from './src/subjects/user';
import { transactionSubject } from './src/subjects/transaction';
import { organizationSubject } from './src/subjects/organization';
import { organizationMemberSubject } from './src/subjects/organization-member';
import { inviteSubject } from './src/subjects/invite';
import { categorySubject } from './src/subjects/category';
import { accountSubject } from './src/subjects/account';

const appAbilitiesSchema = z.union([
  userSubject,
  transactionSubject,
  organizationSubject,
  organizationMemberSubject,
  inviteSubject,
  categorySubject,
  accountSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;
