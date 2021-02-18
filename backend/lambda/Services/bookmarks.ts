import { AppSyncResolverEvent, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { AddBookmarkParams } from "../../Interfaces";
// import { v4 } from "uuid";
class Bookmarks {
  documentClient: DynamoDB.DocumentClient;
  tableName: string;
  constructor(tableName: string) {
    this.documentClient = new DynamoDB.DocumentClient();
    this.tableName = tableName;
  }
  addBookmark = async (
    event: AppSyncResolverEvent<AddBookmarkParams>,
    context: Context
  ) => {
    const res = await this.documentClient
      .update({
        TableName: this.tableName,
        Key: { docId: context.awsRequestId },
        UpdateExpression: "SET link = :link, title = :title",
        ExpressionAttributeValues: {
          ":link": event.arguments.link,
          ":title": event.arguments.title,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return res;
  };
  bookmarks = async (event: AppSyncResolverEvent<any>, context: Context) => {
    const res = await this.documentClient
      .scan({
        TableName: this.tableName,
      })
      .promise();
    return res;
  };
}

export default Bookmarks;
