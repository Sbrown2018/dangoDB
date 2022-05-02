/*Create a query class*/

import { Collection } from '../deps.ts';
import { Connection } from './connections.ts';

interface MatchInterface {
  $match: { [unknownKeyName: string]: string };
}

interface GroupInterface {
  $group: {
    [unknownKeyName: string]: string | { $sum: number };
  };
}

class Query {
  public collectionName: string;
  // Refactor how connection is brought in
  public connection: Connection;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.connection = new Connection(
      'mongodb+srv://wgreco13:g3HUuathwbVEisEj@cluster0.adcc3.mongodb.net/dangoDB?authMechanism=SCRAM-SHA-1'
    );
  }
  /*Returns one document that satisfies the specified query criteria on the collection or view.  */
  public async findOne(queryObject: Record<string, string>) {
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const data = await collection.findOne(queryObject);
      console.log(data);

      await this.connection.disconnect();
    } catch (error) {
      throw new Error(`Error in findOne function. ${error}`);
    }
  }
  /*Selects documents in a collection or view and returns a cursor to the selected documents. */
  public async find(allQueryObjects?: object) {
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const data = await collection.find(allQueryObjects);
      const dataRes = await data.toArray();

      console.log(dataRes);

      await this.connection.disconnect();
    } catch (error) {
      throw new Error(`Error in find function. ${error}`);
    }
  }
  /* Returns the count of documents that match the query for a collection or view. */
  public async countDocuments(queryObject: Record<string, string>) {
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const data = await collection.countDocuments(queryObject);

      console.log(data);

      await this.connection.disconnect();
    } catch (error) {
      throw new Error(`Error in countDocuments function. ${error}`);
    }
  }
  /*estimatedDocumentCount() = Returns the count of all documents in a collection or view. The method wraps the count command. */
  public async estimatedDocumentCount() {
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const data = await collection.estimatedDocumentCount();

      console.log(data);

      await this.connection.disconnect();
    } catch (error) {
      throw new Error(`Error in estimatedDocumentCount function. ${error}`);
    }
  }
  /*Aggregation operations process multiple documents and return computed results. You can use aggregation operations to:
      Group values from multiple documents together.
      Perform operations on the grouped data to return a single result.
      Analyze data changes over time. */

  //  public async aggregate(arg1: [{$match:{[unknownKeyName:string]: string}}]) {
  // public async aggregate(arg1: MatchInterface[], arg2: GroupInterface[]) {
  //   const db = await this.connection.connect();

  //   const collection = db.collection(this.collectionName);
  //   const data = await collection.aggregate(arg1, arg2);
  //   const dataRes = await data.toArray();

  //   console.log(dataRes);

  //   await this.connection.disconnect();
  // }
  // catch(error) {
  //   throw new Error(`Error in aggregate function. ${error}`);
  // }
  /* Celeste's queries */
  // ------- Replace One ---------
  public async replaceOne (
    filter: Record<string, unknown>,
    document: Record<string, unknown>,
    options?: Record<string, unknown>
  ) {
    try {
      //connect to the db
      const db = await this.connection.connect();
      // find the id given in the filter - the find method is available for use
      const collection = db.collection(this.collectionName);
      const data = await collection.replaceOne(filter, document, options);
      // console.log(data); //returned as ex.{ upsertedId: undefined, upsertedCount: 0, matchedCount: 1, modifiedCount: 1 }
  
      // do we want to include upsert: true option to check if no documents match the filter of which we can add one?
      /* should return a document containing a boolen acknowledged: true if succesful, a matchedCount showing how many matches there were and if we want to do the upsert method, the _id for that.
       */
      await this.connection.disconnect();
      return data;
    } catch (error) {
      throw new Error(`Error in replaceOne function. ${error}`);
    }
  }
  // -------- Insert One --------
   public async insertOne(document: Record<string, string>) {
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const id = await collection.insertOne(document);

      await this.connection.disconnect();
      return id;
    } catch (error) {
      throw new Error(`Error in insertOne function. ${error}`);
    }
  }

  // -------- Insert Many --------
  public async insertMany(document: Record<string, unknown>[], options?: Record<string, unknown> | ((input: unknown) => unknown), callback?:(input: unknown) => unknown) {
    try {

      const db = await this.connection.connect();
      const collection = db.collection(this.collectionName);
      // check if options is a function and reassign callback to options if so - so that we can bypass the options param
      if (typeof options === 'function') callback = options
      options = {};

      const ids = await collection.insertMany(document, options);
      if (callback) return await callback(ids);

      await this.connection.disconnect();
      return ids;
    } catch (error) {
      throw new Error(`Error in insertMany function. ${error}`);
    }
  }

  //stephen's changes
  public async dropCollection() {
    // when testing, create a new collection with garbage documents and pass that in Query object
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const data = await collection.drop();
      console.log(data);
    } catch (error) {
      //  need to update error handling
      throw new Error(`Error in dropCollection function. ${error}`);
    }
  }
  public async deleteOne(queryObject: Record<string, unknown>) {
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const data = await collection.deleteOne(queryObject); // returns number of deleted documents
      console.log(data);
      const formattedReturnObj = { deletedCount: data };
      console.log(formattedReturnObj);

      await this.connection.disconnect();
    } catch (error) {
      //  need to update error handling
      throw new Error(`Error in deleteOne function. ${error}`);
    }
  }
  public async deleteMany(queryObject: Record<string, unknown>) {
    // tested on non-existent documents, and multiple documents
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      const data = await collection.deleteMany(queryObject); // returns number of deleted documents
      console.log(data);
      const formattedReturnObj = { deletedCount: data };
      console.log(formattedReturnObj);
    } catch (error) {
      //  need to update error handling
      throw new Error(`Error in deleteMany function. ${error}`);
    }
  }
  // need to modify 2nd param to be Record or Array, check mongoose docs
  // updates specified field(s), uses $set operator: changes values of properties at updateObject
  // updateObject might be an object with several properties (COMPLETE), or even nested - update to account for that variability

  public async updateOne(
    queryObject: Record<string, unknown>,
    updateObject: Record<string, unknown>,
    options?: Record<string, unknown>
  ) {
    // options param: only tested upsert set to true.
    // if upsert is true, and no matching documents are found, updateObject( regardless of how complete it is) will be inserted.
    // tested queryObject with 1 or more properties; tested updateObject with multiple properties.
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      //  $set operator, check mongoDB atlas docs for updateOne for ref
      const setUpdateObject = { $set: updateObject };
      const data = await collection.updateOne(
        queryObject,
        setUpdateObject,
        options
      );
      console.log(data);
      await this.connection.disconnect();
    } catch (error) {
      //  need to update error handling
      throw new Error(`Error in updateOne function. ${error}`);
    }
  }
  public async updateMany(
    queryObject: Record<string, unknown>,
    updateObject: Record<string, unknown>,
    options?: Record<string, unknown>
  ) {
    // options param: only tested upsert set to true.
    // if upsert is true, and no matching documents are found, updateObject( regardless of how complete it is) will be inserted.
    try {
      const db = await this.connection.connect();

      const collection = db.collection(this.collectionName);
      //  $set operator, check mongoDB atlas docs for updateOne for ref
      const setUpdateObject = { $set: updateObject };
      const data = await collection.updateMany(
        queryObject,
        setUpdateObject,
        options
      );
      console.log(data);
      await this.connection.disconnect();
    } catch (error) {
      //  need to update error handling
      throw new Error(`Error in updateMany function. ${error}`);
    }
  }
}

const query = new Query('new');

// query.findOne({ username: 'BobsBackBaby' });
query.find()
// query.updateOne({ username: 'Bob' });
// query.replaceOne({username: 'newtest'}, { username: 'BobsBackBaby'} );
// query.countDocuments({ username: 'test' });
// query.estimatedDocumentCount();
// query.aggregate([
//   { $match: { username: 'test' } },
//   { $group: { _id: '$username', total: { $sum: 1 } } },
// ]);
// query.insertMany([ { username: 'insertingOne'}, { username: 'insertingMany' }], (input) => {console.log('callback executed', input)});

export { Query };
