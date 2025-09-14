// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import { Provider } from 'react-redux';
// import App from './App.tsx';
// import { store } from './app/store.ts';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </StrictMode>,
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // <-- MUST import Tailwind here
import { Provider } from 'react-redux';
import { store } from './app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

