import { ContextProvider } from "@aws-cdk/core";
import { Context, AppSyncResolverEvent } from "aws-lambda";
import { BookmarkFieldName } from "../Interfaces";
import Bookmarks from "./Services/bookmarks";
export async function handler(
  event: AppSyncResolverEvent<any>,
  context: Context
): Promise<any> {
  const fieldName = event.info.fieldName as BookmarkFieldName;
  const bookmarkref = new Bookmarks(process.env.TABLE || "");
  switch (fieldName) {
    case "addBookmark":
      const addBookmarkResults = await bookmarkref.addBookmark(event, context);
      return addBookmarkResults.Attributes;
    case "bookmarks":
      const getBookmarks = await bookmarkref.bookmarks(event, context);
      return getBookmarks.Items;
    default:
      throw new Error("Something went wrong with supplied method");
  }
}
