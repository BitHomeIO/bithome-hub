export class Node {
    public createdAt: Date;
    public id: string;
    public name: string;
    public source: string;
    public capabilities: string[];

    constructor(createdAt: Date,
                id: string,
                name: string,
                source: string,
                capabilities: string[]) {
        this.createdAt = createdAt;
        this.id = id;
        this.name = name;
        this.source = source;
        this.capabilities = capabilities;
    }
}

