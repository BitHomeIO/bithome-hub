export class Message {
    public createdAt: Date;
    public nodeId: string;
    public topic: string;
    public message: string;

    constructor(createdAt: Date, nodeId: string, topic: string, message: string) {
        this.createdAt = createdAt;
        this.nodeId = nodeId;
        this.topic = topic;
        this.message = message;
    }

    public getMessage(): string {
        return this.message;
    }
    public getNodeId(): string {
        return this.nodeId;
    }
    public getTopic(): string {
        return this.topic;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
}

