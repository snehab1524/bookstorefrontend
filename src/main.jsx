import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/index.js'
import { initAuth, fetchUser } from './store/auth.js'
// Init auth persistence
const token = localStorage.getItem('token')
if (token) {
  store.dispatch(initAuth())
  store.dispatch(fetchUser())
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>,
)
