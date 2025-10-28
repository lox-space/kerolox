<script lang="ts">
  import { T } from "@threlte/core";
  import {
    Gizmo,
    MeshLineGeometry,
    MeshLineMaterial,
    OrbitControls,
  } from "@threlte/extras";
  import { Vector3 } from "three";
  import Earth from "./Earth.svelte";

  interface Props {
    points: Vector3[];
    position: [number, number, number];
  }

  let { points, position }: Props = $props();
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 7e4]} far={1e12}>
  <OrbitControls>
    <Gizmo />
  </OrbitControls>
</T.PerspectiveCamera>

<T.AmbientLight intensity={2} />

<T.GridHelper args={[1e5, 1e1]} />

<T.Mesh>
  <MeshLineGeometry {points} />
  <MeshLineMaterial color="red" attenuate={false} width={2} />
</T.Mesh>

<Earth />

<T.Mesh {position}>
  <T.SphereGeometry args={[1000, 64, 64]} />
  <T.MeshStandardMaterial color="red" />
</T.Mesh>
