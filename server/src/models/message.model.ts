import {MessageInterface} from "../interfaces/message.interface";
import {User} from "./user.model";

export class Message implements MessageInterface {
	user: User;

	text: string;

	timestamp: Date;

	constructor(user: User, text: string, timestamp: Date) {
		this.user = user;
		this.text = text;
		this.timestamp = timestamp;
	}
}
