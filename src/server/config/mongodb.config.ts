import * as mongoose from 'mongoose';
import {Db} from 'mongodb';
import {ConnectionOptions} from 'mongoose';

const url: string = 'mongodb://localhost:27017/bithome';

export class MongoDBConnection {
  private static isConnected: boolean = false;
  private static db: Db;


  public static getConnection(result: (connection: any) => void) {
    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect((error: any) => {
        return result(this.db);
      });
    }
  }

  private static connect(result: (error: any) => void) {
    (mongoose as any).Promise = global.Promise;


    mongoose.connect(url, (err: any) => {
      if (err) {
        console.log(err.message);
        console.log(err);
      }
      else {
        this.isConnected = true;
        console.log('Connected to MongoDb at ' + url);
      }
    });
    // MongoClient.connect(url, (error: any, db: Db) => {
    //   this.db = db;
    //   this.isConnected = true;
    //
    //   return result(error, db);
    // });
  }
}
