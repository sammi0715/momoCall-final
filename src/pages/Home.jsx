import happy from "../images/happy.png";

function Home() {
  return (
    <div className="w-container max-w-screen min-h-screen m-[auto] bg-black-200 flex flex-col justify-center items-center gap-4 px-3 font-sans">
      <img src={happy} alt="" className="w-fit h-fit" />
      <h2 className="text-xl leading-normal text-black font-bold">生活大小事，都是 momo 的事</h2>
      <button className="bg-primary-800 text-black-0 rounded-large py-2 px-6">進入聊天室</button>
      <button className="bg-secondary text-black-0 rounded-large py-2 px-6">管理者登入</button>
    </div>
  );
}
export default Home;
