class Message {
    private timestamp: string;
    private node: string;
    private channel: string;
    private message: string;

    constructor(timestamp: string, node: string, channel: string, message: string) {
        this.timestamp = timestamp;
        this.node = node;
        this.channel = channel;
        this.message = message;
    }

    public getMessage(): string {
        return this.message;
    }
}

