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
import type { User } from './src/models/user';

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

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  // if (typeof permissions[user.role] !== 'function') {
  //     throw new Error(`Permissions for role ${user.role} not found.`);
  //   }

  //   permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
