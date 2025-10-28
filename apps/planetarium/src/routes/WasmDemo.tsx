import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import init, {
  greet,
  orbital_velocity,
  deg_to_rad,
  rad_to_deg,
} from "@lox-space/wasm";

const WasmDemo = () => {
  const [wasmReady, setWasmReady] = useState(false);
  const [greetingName, setGreetingName] = useState("Astronaut");
  const [greetingResult, setGreetingResult] = useState("");

  // Orbital velocity inputs
  const [mu, setMu] = useState("398600.4418"); // Earth's μ
  const [radius, setRadius] = useState("6700"); // LEO radius
  const [velocity, setVelocity] = useState<number | null>(null);

  // Angle conversion inputs
  const [degrees, setDegrees] = useState("180");
  const [radians, setRadians] = useState("");
  const [radiansInput, setRadiansInput] = useState("3.14159");
  const [degreesOutput, setDegreesOutput] = useState("");

  useEffect(() => {
    init()
      .then(() => {
        setWasmReady(true);
        // Calculate initial values
        handleGreet();
        handleCalculateVelocity();
        handleDegToRad();
        handleRadToDeg();
      })
      .catch((err) => {
        console.error("Failed to initialize WASM:", err);
      });
  }, []);

  const handleGreet = () => {
    if (!wasmReady) return;
    const result = greet(greetingName);
    setGreetingResult(result);
  };

  const handleCalculateVelocity = () => {
    if (!wasmReady) return;
    const muVal = parseFloat(mu);
    const radiusVal = parseFloat(radius);
    if (!isNaN(muVal) && !isNaN(radiusVal) && radiusVal > 0) {
      const vel = orbital_velocity(muVal, radiusVal);
      setVelocity(vel);
    }
  };

  const handleDegToRad = () => {
    if (!wasmReady) return;
    const deg = parseFloat(degrees);
    if (!isNaN(deg)) {
      const rad = deg_to_rad(deg);
      setRadians(rad.toFixed(10));
    }
  };

  const handleRadToDeg = () => {
    if (!wasmReady) return;
    const rad = parseFloat(radiansInput);
    if (!isNaN(rad)) {
      const deg = rad_to_deg(rad);
      setDegreesOutput(deg.toFixed(6));
    }
  };

  if (!wasmReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading WASM Module...</div>
          <div className="text-gray-600">Initializing WebAssembly</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">
            WASM Demo
          </h1>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-gray-700 mb-8">
          This page demonstrates the WebAssembly functions from @lox-space/wasm.
          All calculations are performed using Rust compiled to WebAssembly.
        </p>

        <div className="space-y-6">
          {/* Greeting Demo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              String Handling: greet()
            </h2>
            <p className="text-gray-600 mb-4">
              Demonstrates passing strings between JavaScript and WebAssembly.
            </p>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={greetingName}
                  onChange={(e) => setGreetingName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGreet()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <button
                onClick={handleGreet}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Greet
              </button>
            </div>
            {greetingResult && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-900">
                {greetingResult}
              </div>
            )}
          </div>

          {/* Orbital Velocity Demo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Orbital Mechanics: orbital_velocity()
            </h2>
            <p className="text-gray-600 mb-4">
              Calculate orbital velocity using: v = √(μ / r)
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gravitational Parameter (μ) [km³/s²]
                </label>
                <input
                  type="number"
                  value={mu}
                  onChange={(e) => setMu(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.0001"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Earth: 398600.4418 km³/s²
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orbital Radius (r) [km]
                </label>
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  LEO: ~6700 km, GEO: ~42164 km
                </p>
              </div>
            </div>
            <button
              onClick={handleCalculateVelocity}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Calculate
            </button>
            {velocity !== null && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-900 font-semibold">
                  Orbital Velocity: {velocity.toFixed(6)} km/s
                </p>
                <p className="text-sm text-green-700 mt-1">
                  ({(velocity * 3600).toFixed(2)} km/h)
                </p>
              </div>
            )}
          </div>

          {/* Angle Conversion Demo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Angle Conversion
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Degrees to Radians */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">
                  Degrees → Radians
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degrees
                    </label>
                    <input
                      type="number"
                      value={degrees}
                      onChange={(e) => setDegrees(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>
                  <button
                    onClick={handleDegToRad}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                  >
                    Convert
                  </button>
                  {radians && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <p className="text-purple-900 font-mono">
                        {radians} rad
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Radians to Degrees */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">
                  Radians → Degrees
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radians
                    </label>
                    <input
                      type="number"
                      value={radiansInput}
                      onChange={(e) => setRadiansInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>
                  <button
                    onClick={handleRadToDeg}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                  >
                    Convert
                  </button>
                  {degreesOutput && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <p className="text-purple-900 font-mono">
                        {degreesOutput}°
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              About This Demo
            </h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>
                • All calculations are performed in WebAssembly (Rust compiled to WASM)
              </li>
              <li>
                • WASM provides near-native performance for computationally intensive tasks
              </li>
              <li>
                • The module is loaded asynchronously using top-level await (ES2022)
              </li>
              <li>
                • TypeScript definitions are automatically generated by wasm-pack
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasmDemo;
