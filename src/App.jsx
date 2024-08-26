import { Outlet } from "react-router-dom";
import Finish from "./pages/Finish";

function App() {
  return (
    <>
      <Finish></Finish>
      <Outlet />
    </>
  );
}

export default App;
