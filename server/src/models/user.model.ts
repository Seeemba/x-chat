import {UserInterface} from "../interfaces/user.interface";

export class User implements UserInterface {
	id: number;

	socketId: string;

	nickname: string;

	public constructor(id: number, socketId: string, nickname: string) {
		this.id = id;
		this.socketId = socketId;
		this.nickname = nickname;
	}
}
