<script lang="ts">
  import { KeplerianElements } from "@lox-space/wasm";
  import { T } from "@threlte/core";
  import { MeshLineGeometry, MeshLineMaterial } from "@threlte/extras";
  import { Vector3 } from "three";
  import { ICRF_TO_THREE } from "../../utils";

  const gravParam = 398600.43550702266;

  interface Props {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    longitudeOfAscendingNode: number;
    argumentOfPeriapsis: number;
    trueAnomaly: number;
  }

  let {
    semiMajorAxis,
    eccentricity,
    inclination,
    longitudeOfAscendingNode,
    argumentOfPeriapsis,
    trueAnomaly,
  }: Props = $props();

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
    v.applyMatrix4(ICRF_TO_THREE);

    return [v.x, v.y, v.z];
  });

  let points = $derived.by(() => {
    const points = orbit.trace(gravParam, 360);
    return Array.from(points.x).map((x, idx) => {
      let y = points.y[idx];
      let z = points.z[idx];

      let v = new Vector3(x, y, z);
      v.applyMatrix4(ICRF_TO_THREE);

      return v;
    });
  });
</script>

<T.Mesh>
  <MeshLineGeometry {points} />
  <MeshLineMaterial color="red" attenuate={false} width={2} />
</T.Mesh>
<T.Mesh {position}>
  <T.SphereGeometry args={[1000, 64, 64]} />
  <T.MeshStandardMaterial color="red" />
</T.Mesh>
