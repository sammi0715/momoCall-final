import happy from "../images/happy.png";
import annoy from "../images/annoy.png";
import momo from "../images/momocallLogo.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-container max-w-screen min-h-screen m-[auto] bg-black-0 flex flex-col justify-center items-center gap-4 px-3 font-sans">
      <img src={momo} alt="" className="w-fit h-fit" />
      <img src={happy} alt="" className="w-fit h-fit hidden" />
      <img src={annoy} alt="" className="w-fit h-fit hidden" />
      <h2 className="text-xl leading-normal text-black font-bold">生活大小事，都是 momo 的事</h2>
      <button className="bg-primary-800 text-black-0 rounded-large py-2 px-6 hover:bg-primary-600">
        <Link to="/search">進入聊天室</Link>
      </button>
      <button className="bg-secondary text-black-0 rounded-large py-2 px-6 hover:bg-secondary-400">
        <Link to="/admin">管理者登入</Link>
      </button>
    </div>
  );
}
export default Home;
