
import TYPES from '../constants/identifiers';
import {MongoDBClient} from '../client/mongodb.client';
import {inject, injectable} from 'inversify';
import {User} from '../models/user';

@injectable()
export class UserService {
  private mongoClient: MongoDBClient;

  constructor(
    @inject(TYPES.MongoDBClient) mongoClient: MongoDBClient) {

    this.mongoClient = mongoClient;
  }
  //
  // public getUsers(): Promise<User[]> {
  //   return new Promise<User[]>((resolve, reject) => {
  //     this.mongoClient.find('user', {}, (error: any, data: User[]) => {
  //       resolve(data);
  //     });
  //   });
  // }
  //
  // public getUser(id: string): Promise<User> {
  //   return new Promise<User>((resolve, reject) => {
  //     this.mongoClient.findOneById('user', id, (error: any, data: User) => {
  //       resolve(data);
  //     });
  //   });
  // }
  //
  // public newUser(user: User): Promise<User> {
  //   return new Promise<User>((resolve, reject) => {
  //     this.mongoClient.insert('user', user, (error: any, data: User) => {
  //       resolve(data);
  //     });
  //   });
  // }
  //
  // public updateUser(id: string, user: User): Promise<User> {
  //   return new Promise<User>((resolve, reject) => {
  //     this.mongoClient.update('user', id, user, (error: any, data: User) => {
  //       resolve(data);
  //     });
  //   });
  // }
  //
  // public deleteUser(id: string): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.mongoClient.remove('user', id, (error: any, data: any) => {
  //       resolve(data);
  //     });
  //   });
  // }
}
