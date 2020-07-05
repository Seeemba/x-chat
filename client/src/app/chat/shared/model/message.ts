import {User} from './user';
import {Action} from './action';

export interface Message {
  action?: Action;
  content?: any;
  from?: User;
  timestamp?: Date;
}
