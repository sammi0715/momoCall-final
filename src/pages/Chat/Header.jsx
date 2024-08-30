import { FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-black-200 w-container px-3 fixed top-0 left-0 right-0 z-10 my-0 mx-auto">
      <div className="flex items-center py-4">
        <Link to={"/"}>
          <FiChevronLeft className="w-6 h-6 mr-3 cursor-pointer" />
        </Link>
        <h1 className="font-sans font-bold text-2xl leading-normal text-primary ml-20">對話紀錄</h1>
      </div>
    </div>
  );
}
export default Header;
