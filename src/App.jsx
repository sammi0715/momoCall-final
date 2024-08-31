import { Outlet } from "react-router-dom";
import { ChatContextProvider } from "./chatContextProvider";

function App() {
  return (
    <ChatContextProvider>
      <Outlet />
    </ChatContextProvider>
  );
}

export default App;
