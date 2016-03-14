export class Node {
    public createdAt: Date;
    public nodeId: string;
    public name: string;
    public source: string;

    constructor(createdAt: Date,
                nodeId: string,
                name: string,
                source: string) {
        this.createdAt = createdAt;
        this.nodeId = nodeId;
        this.name = name;
        this.source = source;
    }
}

