import * as mongoose from 'mongoose';
export let Schema = mongoose.Schema;

export interface INode extends mongoose.Document {
  id: string;
  name: string;
  source: string;
  createdAt: Date;
  modifiedAt: Date;
}

// Create the schema for the node
let schema = new Schema(
  {
    id : {
      type: String,
      primaryKey: true
    },
    name : String,
    source : String,
    capabilities : [{ type: Schema.Types.ObjectId, ref: 'capability' }],
    updatedAt : Date,
    createdAt : Date
  }).pre('save', function(next) {
  if (this._doc) {
    let doc = <INode>this._doc;
    let now = new Date();
    if (!doc.createdAt) {
      doc.createdAt = now;
    }
    doc.modifiedAt = now;
  }
  next();
  return this;
});

export let NodeSchema = mongoose.model<INode>('node', schema, 'nodes', true);

export class Node {
    private nodeModel: INode;

    constructor(nodeModel: INode) {
      this.nodeModel = nodeModel;
    }

    public getId(): string {
      return this.nodeModel.id;
    }

    public getName(): string {
      return this.nodeModel.name;
    }

    public getSource(): string {
      return this.nodeModel.source;
    }

    public getCreatedAt(): Date {
      return this.nodeModel.createdAt;
    }

    public getModifiedAt(): Date {
      return this.nodeModel.modifiedAt;
    }
}
