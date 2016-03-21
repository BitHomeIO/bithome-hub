export class Action {
    public nodeId: string;
    public capability: string;

    constructor(nodeId: string, capability: string) {
        this.nodeId = nodeId;
        this.capability = capability;
    }
}

