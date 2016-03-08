export class Bridge {
    public createdAt: Date;
    public name: string;
    public status: string;
    public id: string;

    constructor(createdAt: Date,
                name: string,
                id: string,
                status: string) {
        this.createdAt = createdAt;
        this.name = name;
        this.id = id;
        this.status = status;
    }

    public getName(): string {
        return this.name;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}

