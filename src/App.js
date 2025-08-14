import Dashboard from './Dashboard';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (<div className="App">
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
          <Route path="products" element={<Dashboard />} />
          <Route path="products/:id" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
