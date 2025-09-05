export default function ProjectLoading() {
  return (
    <div className="flex flex-col justify-center w-full h-full">
      <nav className="flex justify-between mb-4">
        <div>
          <div className="w-60 h-10 loader"></div>
          <ul className="flex gap-2 mt-2">
            <li>
              <div className="loader w-15 h-7"></div>
            </li>
            <li>
              <div className="loader w-15 h-7"></div>
            </li>
            <li>
              <div className="loader w-15 h-7"></div>
            </li>
          </ul>
        </div>
      </nav>
      <hr className="my-4 border-stone-200/30" />
      <div className="flex flex-col space-y-8 w-full">
        <section className="w-full">
          <div className="loader w-60 h-10 mb-2"></div>
          <div className="loader w-full h-30"></div>
        </section>
        <section className="self-center end w-full">
          <div className="loader w-60 h-10 mb-2"></div>
          <div className="loader w-full h-30"></div>
        </section>
        <section>
          <div className="loader w-60 h-10 mb-2"></div>
          <div className="loader w-full h-30"></div>
        </section>
        <div className="flex space-x-5">
          <div className="loader w-90 h-50"></div>
          <div className="loader w-90 h-50"></div>
          <div className="loader w-90 h-50"></div>
        </div>
      </div>
    </div>
  );
}
