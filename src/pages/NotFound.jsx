import annoy from "../images/annoy.png";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-container max-w-screen min-h-screen m-[auto] bg-black-0 flex flex-col justify-center items-center gap-4 px-3 font-sans">
      <div className="flex items-end">
        <p className="text-5xl leading-normal text-primary font-black font-libre">4</p>
        <img src={annoy} alt="" className="w-fit h-fit" />
        <p className="text-5xl leading-normal text-primary font-black font-libre">4</p>
      </div>
      <h2 className="text-xl leading-normal text-black font-bold">momoCallout</h2>
      <Link to="/search">
        <button className="bg-primary-800 text-black-0 rounded-large py-2 px-6 hover:bg-primary-600">回到聊天室</button>
      </Link>
    </div>
  );
}

export default NotFound;
