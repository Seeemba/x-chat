/**
 * X-Chat Server.
 *
 * @author Serhiy Posokhin
 * @version 1.0.0
 */

import express from 'express';
import ioserver, {Socket} from 'socket.io';
import cors from 'cors';
import * as http from 'http';

import { Message } from './models/message.model';
import { User } from './models/user.model';

export class Server {

	public static readonly DEFAULT_PORT:number = 3001;

	private app: express.Application;

	private server: http.Server;

	private io: SocketIO.Server;

	private port: string | number;

	private activeUsers: User[] = [];

	constructor() {
		this.createApp();
		this.config();
		this.createServer();
		this.sockets();
		this.listen();
	}

	private createApp(): void {
		this.app = express();
		this.app.use(cors());
	}

	private createServer(): void {
		this.server = http.createServer(this.app);
	}

	private config(): void {
		this.port = process.env.PORT || Server.DEFAULT_PORT;
	}

	private sockets(): void {
		this.io = ioserver(this.server);
	}

	private listen(): void {
		this.server.listen(this.port);

		this.io.on('connection', (socket: Socket) => {
			socket.on('new-user', (user: User) => {
				if(!user) {
					return;
				}

				if(!this.activeUsers.some((u) => u.nickname === user.nickname)){
					this.activeUsers.push(user);
					this.io.emit("users", [...this.activeUsers]);
				}
			});

			socket.on('message', (m: Message) => {
				const msg = m;
				msg.timestamp = new Date();
				this.io.emit("message", msg);
			});

			socket.on("disconnect", () => {
				this.activeUsers.splice(this.activeUsers.findIndex((u) => u.socketId === socket.id), 1);
				this.io.emit("users", [...this.activeUsers]);
			});
		});
	}

	public getApp(): express.Application {
		return this.app;
	}
}
