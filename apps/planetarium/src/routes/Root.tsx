import { Link } from "react-router-dom";

const keplerian =
  "keplerian?" +
  new URLSearchParams({
    semiMajor: "7210.008367",
    eccentricity: "0.0001807",
    inclination: "51.6428",
    ascendingNode: "279.6468",
    periapsisArg: "68.3174",
    trueAnomaly: "-68.2025",
  });

const Root = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold pb-4">
        OpenAstrodynamics Planetarium
      </h1>
      <div className="grid grid-cols-2 gap-10">
        <Link
          to={keplerian}
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
        >
          <h5 className="text-xl font-bold tracking-tight text-gray-900">
            Keplerian Elements
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default Root;
