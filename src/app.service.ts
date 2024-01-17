import { Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class AppService {
  constructor() {}

  async getHello(): Promise<any> {
    const db = getFirestore();
    const coll = await db.listCollections();
    console.log(coll);
    return coll;
  }
}
