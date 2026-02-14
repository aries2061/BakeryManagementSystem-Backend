import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // Adjust in production
    },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(AppGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinBranch')
    handleJoinBranch(@MessageBody() branchId: string, @ConnectedSocket() client: Socket) {
        client.join(`branch_${branchId}`);
        this.logger.log(`Client ${client.id} joined branch_${branchId}`);
        return { event: 'joinedBranch', data: branchId };
    }

    // Method to emit events to specific branch
    emitToBranch(branchId: string, event: string, data: any) {
        this.server.to(`branch_${branchId}`).emit(event, data);
    }
}
