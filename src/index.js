import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Jaggo from './routes/jaggo';
import Wedding from './routes/wedding';
import Reception from './routes/reception';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  palette: {
      type: 'light',
      primary: {
        main: '#ffab40',
      },
      secondary: {
        main: '#f50057',
      },
    },
});

root.render(
  
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}/>
          <Route path="/jaggo" element={<Jaggo />}/>
          <Route path="/wedding" element={<Wedding />}/>
          <Route path="/reception" element={<Reception />}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
