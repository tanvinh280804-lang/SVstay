import { BrowserRouter } from "react-router-dom";

import IndexRoutes from "./routes/index.routes";

function App() {
  return (
    <BrowserRouter>
      <IndexRoutes />
    </BrowserRouter>
  );
}

export default App;