import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://my-first-worker.gaojieli2020.workers.dev/graphql", // 也可自定义域名
    fetchOptions: { mode: "cors" },
  }),
  cache: new InMemoryCache(),
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
