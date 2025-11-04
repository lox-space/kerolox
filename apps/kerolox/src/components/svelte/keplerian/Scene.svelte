<script lang="ts">
  import { T } from "@threlte/core";
  import { Gizmo, OrbitControls } from "@threlte/extras";
  import Earth from "../Earth.svelte";
  import KeplerianOrbit from "../KeplerianOrbit.svelte";

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
</script>

<!-- Helper -->
<T.GridHelper args={[1e5, 1e1]} />

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[0, 0, 7e4]} far={1e12}>
  <OrbitControls>
    <Gizmo />
  </OrbitControls>
</T.PerspectiveCamera>

<!-- Light -->
<T.AmbientLight intensity={2} />

<!-- Action -->
<Earth />
<KeplerianOrbit
  {semiMajorAxis}
  {eccentricity}
  {inclination}
  {longitudeOfAscendingNode}
  {argumentOfPeriapsis}
  {trueAnomaly}
/>
