<script lang="ts">
  import init, { rad_to_deg, KeplerianElements } from "@lox-space/wasm";
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import Settings from "./Settings.svelte";
  import { Matrix4, Vector3, WebGLRenderer } from "three";

  // prettier-ignore
  const to_three = new Matrix4().set(
    1, 0, 0, 0,
    0, 0, 1, 0,
    0, -1, 0, 0,
    0, 0, 0, 1
  );

  await init();

  let gravParam = 398600.43550702266;

  let semiMajorAxis = $state(24464.0);
  let eccentricity = $state(0.7311);
  let inclination = $state(rad_to_deg(0.122138));
  let longitudeOfAscendingNode = $state(rad_to_deg(1.00681));
  let argumentOfPeriapsis = $state(rad_to_deg(3.10686));
  let trueAnomaly = $state(rad_to_deg(0.44369564302687126));

  let orbit = $derived(
    new KeplerianElements(
      semiMajorAxis,
      eccentricity,
      inclination,
      longitudeOfAscendingNode,
      argumentOfPeriapsis,
      trueAnomaly
    )
  );

  let position = $derived.by((): [number, number, number] => {
    let [x, y, z] = orbit.position(gravParam);

    let v = new Vector3(x, y, z);
    v.applyMatrix4(to_three);

    return [v.x, v.y, v.z];
  });

  let points = $derived.by(() => {
    const points = orbit.trace(gravParam, 360);
    return Array.from(points.x).map((x, idx) => {
      let y = points.y[idx];
      let z = points.z[idx];

      let v = new Vector3(x, y, z);
      v.applyMatrix4(to_three);

      return v;
    });
  });
</script>

<div class="fixed inset-0 overflow-hidden">
  <Canvas
    createRenderer={(canvas) => {
      return new WebGLRenderer({
        canvas,
        logarithmicDepthBuffer: true,
      });
    }}
  >
    <Scene {points} {position} />
  </Canvas>
</div>

<Settings
  bind:semiMajorAxis
  bind:eccentricity
  bind:inclination
  bind:longitudeOfAscendingNode
  bind:argumentOfPeriapsis
  bind:trueAnomaly
/>
