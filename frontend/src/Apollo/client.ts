import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import fetch from "isomorphic-fetch"
const link = new HttpLink({
  uri:
    "https://c3gx25a7jfaajgdy2u2lzcsmpm.appsync-api.ap-south-1.amazonaws.com/graphql",
  fetch,
  headers: {
    "x-api-key": "da2-lymrvxq6zbegbb6xjxsecn72re",
  },
})
export const createApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  })
}
