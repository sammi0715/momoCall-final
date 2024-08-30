import { Outlet } from "react-router-dom";
import { ChatContextProvider } from "./chatContext";

function App() {
  return (
    <ChatContextProvider>
      <Outlet />
    </ChatContextProvider>
  );
}

export default App;
