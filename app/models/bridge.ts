export class Bridge {
    public createdAt: Date;
    public name: string;

    constructor(createdAt: Date, name: string) {
        this.createdAt = createdAt;
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}

