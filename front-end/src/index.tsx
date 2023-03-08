import "index.css"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { createStore } from "redux"
import { GlobalStyle } from "shared/styles/global-style"
import StaffApp from "staff-app/app"
import reducer from "./reducers"

const Home: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <p>Engineering Test</p>
        <Link to="staff/daily-care">Staff</Link>
      </header>
    </div>
  )
}
const store = createStore(reducer)

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home>Engineering Test</Home>} />
          <Route path="staff/*" element={<StaffApp />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
