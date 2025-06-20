import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import { Toaster } from "react-hot-toast";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
