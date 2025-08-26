import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { QueryClient, QueryClientProvider } from "react-query"
const queryClient = new QueryClient()
import { LoadingBarContainer } from "react-top-loading-bar"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LoadingBarContainer>
        <App />
      </LoadingBarContainer>
    </QueryClientProvider>
  </React.StrictMode>
)
