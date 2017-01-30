import {autoserialize} from 'cerialize';

export class StatusResponse {
    @autoserialize public status: string;
    @autoserialize public success: boolean;
}

