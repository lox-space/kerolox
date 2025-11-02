import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./Scene.tsx";
import { LoxProvider } from "@lox-space/react";

const KeplerianWidget = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <Canvas
        onCreated={({ gl }) => gl.setClearColor("#000000")}
        gl={{ logarithmicDepthBuffer: true }}
      >
        <Suspense fallback={null}>
          <LoxProvider fallback={null}>
            <Scene />
          </LoxProvider>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default KeplerianWidget;
