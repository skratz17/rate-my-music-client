import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import { RateMyMusic } from './components/RateMyMusic';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RateMyMusic />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
