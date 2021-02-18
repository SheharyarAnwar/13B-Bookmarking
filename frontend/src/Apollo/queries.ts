import { gql } from "@apollo/client"

export const GET_BOOKMARKS = gql`
  query {
    bookmarks {
      link
      title
    }
  }
`
export const ADD_BOOKMARK = gql`
  mutation($title: String!, $link: String!) {
    addBookmark(title: $title, link: $link) {
      link
      title
    }
  }
`
