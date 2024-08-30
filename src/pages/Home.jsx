function Home() {
  return (
    <div className="w-container max-w-screen h-screen m-[auto] bg-black-200 flex flex-col justify-center items-center gap-4 px-3">
      <h1>Home</h1>
      <h2 className="text-xl leading-normal font-bold">生活大小事，都是 momo 的事</h2>
      <button className="bg-primary-800 text-black-0 text-base leading-normal py-2 px-6 rounded-large hover:bg-primary">進入聊天室</button>
      <button className="bg-secondary text-black-0 text-base leading-normal py-2 px-6 rounded-large">管理者登入</button>
    </div>
  );
}

export default Home;
