import {User} from "../models/user.model";

export interface MessageInterface {
	user: User;
	text: string;
	timestamp: Date;
}
