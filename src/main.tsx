import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import TemporaryEmail from "./App.tsx";

const apiUrl = 'http://localhost:5173/api/pigeomail/v1';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TemporaryEmail apiUrl={apiUrl}/>
    </React.StrictMode>,
)
