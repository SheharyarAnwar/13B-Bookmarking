import React, { useEffect, useState } from "react"

import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from "./Apollo/client"

const Index = ({ children }) => {
  useEffect(() => {}, [])
  return (
    <>
      <ApolloProvider client={createApolloClient()}>{children}</ApolloProvider>
    </>
  )
}

export default Index
