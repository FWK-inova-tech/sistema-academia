import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import './style/index.css'
import './styles/design-tokens.css'
import './components/ui/Button/Button.css'
import './components/ui/Input/Input.css'
import './components/ui/Card/Card.css'
import './components/ui/Loading/Loading.css'
import './components/ui/Table/Table.css'
import App from './App.tsx'
import { store } from './stores/appStore.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
