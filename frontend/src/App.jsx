import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/loginForm";
import ChatRoom from "./components/ChatRoom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
