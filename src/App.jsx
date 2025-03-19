import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Tasks from './pages/Tasks';

import './App.css'

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="app-logo" />
          <p className="app-name">Task Manager Pro 9000</p>
        </header>
        <Routes>
          <Route path="/" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
    </QueryClientProvider>
  )
}

export default App;
