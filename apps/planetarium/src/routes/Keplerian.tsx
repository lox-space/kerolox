import { Link } from "react-router-dom";
import Planetarium from "@lox-space/r3f";

const Keplerian = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-[300px] p-4">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
        >
          Back
        </Link>
      </div>
      {/*<Planetarium />*/}
    </div>
  );
};

export default Keplerian;
