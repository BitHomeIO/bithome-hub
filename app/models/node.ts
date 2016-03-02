export class Node {
    public createdAt: Date;
    public nodeId: string;

    constructor(createdAt: Date, nodeId: string) {
        this.createdAt = createdAt;
        this.nodeId = nodeId;
    }

    public getNodeId(): string {
        return this.nodeId;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}

