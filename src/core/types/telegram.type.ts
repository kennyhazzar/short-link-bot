import { Context } from 'telegraf';
import { User } from '../../modules/users/entities';

type ContextState = Record<string | symbol, any>;

export class MainUpdateContext extends Context {
  state: ContextState & { user: User };
}
