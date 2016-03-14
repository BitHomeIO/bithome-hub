export class Node {
    public createdAt: Date;
    public nodeId: string;
    public name: string;
    public source: string;
    public capabilities: string[];

    constructor(createdAt: Date,
                nodeId: string,
                name: string,
                source: string,
                capabilities: string[]) {
        this.createdAt = createdAt;
        this.nodeId = nodeId;
        this.name = name;
        this.source = source;
        this.capabilities = capabilities;
    }
}

