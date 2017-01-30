import * as mongoose from 'mongoose';
import {INode} from './node';
export let Schema = mongoose.Schema;

export interface ICapability extends mongoose.Document {
  capability: string;
  node: INode;
  createdAt: Date;
}

// Create the schema for the node
let schema = new Schema(
  {
    capability : String,
    _node : { type: Number, ref: 'node' },
    createdAt : Date
  }).pre('save', function(next) {
  if (this._doc) {
    let doc = <ICapability>this._doc;
    let now = new Date();
    if (!doc.createdAt) {
      doc.createdAt = now;
    }
  }
  next();
  return this;
});

export let CapabilitySchema = mongoose.model<ICapability>('capability', schema, 'capabilities', true);

export class Capability {
    private capabilityModel: ICapability;

    constructor(capabilityModel: ICapability) {
      this.capabilityModel = capabilityModel;
    }

    public getCapability(): string {
      return this.capabilityModel.capability;
    }

    // public getNode(): INode {
    //   return this.capabilityModel.node;
    // }

    public getCreatedAt(): Date {
      return this.capabilityModel.createdAt;
    }
}
