/* eslint-disable react-hooks/rules-of-hooks */
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { useAuth, userPool } from './useAuth'
import { WebSocketLink } from '@apollo/client/link/ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { isArray } from 'lodash'

const getJwtToken = async () => {
  const currentUser = userPool.getCurrentUser()
  if (!currentUser) {
    return ''
  }
  const session = await new Promise<CognitoUserSession>(function (
    resolve,
    reject
  ) {
    currentUser?.getSession(function (err: any, session: CognitoUserSession) {
      if (err) {
        reject(err)
      } else {
        resolve(session)
      }
    })
  })
  return session.getIdToken().getJwtToken()
}

const createLink = () => {
  if (typeof window === 'undefined') {
    return undefined
  }
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
  })

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL as string
  const useGqlWs = wsUrl.includes('localhost')

  const wsLink = useGqlWs
    ? new GraphQLWsLink(
        createClient({
          url: wsUrl,
        })
      )
    : new WebSocketLink(
        new SubscriptionClient(wsUrl, {
          lazy: false,
          reconnect: true,
        })
      )

  const authLink = setContext(async (_, { headers }) => {
    const jwt = await getJwtToken()
    return {
      headers: {
        ...headers,
        authorization: jwt,
      },
    }
  })

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    authLink.concat(wsLink),
    authLink.concat(httpLink)
  )

  return link
}

export const apolloClient = new ApolloClient({
  link: createLink(),
  cache: new InMemoryCache({
    typePolicies: {
      Event: {
        merge(existing, incoming, { mergeObjects }) {
          const merged = mergeObjects(existing, incoming)
          return merged
        },
      },
    },
  }),
  connectToDevTools: true,
  defaultOptions: {
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})
