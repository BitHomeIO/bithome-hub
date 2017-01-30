import {autoserialize, autoserializeAs, SerializableEnumeration} from 'cerialize';

export enum UserStatus {
    ACTIVE
}
SerializableEnumeration(UserStatus);

export class User {
    @autoserialize public id: string;
    @autoserialize public name: string;
    @autoserialize public email: string;
    @autoserialize public password: string;
    @autoserialize public companyId: string;
    @autoserialize public companyName: string;
    @autoserializeAs(UserStatus) public status: UserStatus;
    @autoserializeAs(Date) public updatedAt: Date;
    @autoserializeAs(Date) public createdAt: Date;

    public statusString = () : string => {
        return UserStatus[this.status];
    }
}

