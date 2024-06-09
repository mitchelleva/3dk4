import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Edges, MeshPortalMaterial, CameraControls, Environment, PivotControls, SpotLight, Lightformer, shaderPass } from '@react-three/drei';
import { useControls } from 'leva';

export const App = () => (
  <Canvas shadows camera={{ position: [-3, 0.5, 3] }}>
    <PivotControls anchor={[-1.1, -1.1, -1.1]} scale={0.75} lineWidth={3.5}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <Edges />


        {/* SIDE A */}
        <Side rotation={[0, 0, 0]} bg="#fff" index={0}>
          <MitchMadeA />     
          
          
        </Side>

    {/* SIDE B */}

        <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
          <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
        </Side>

    {/* SIDE C */}

        <Side rotation={[0, Math.PI / 2, Math.PI / 2]} bg="lightgreen" index={2}>
          <boxGeometry args={[1.15, 1.15, 1.15]} />
        </Side>

    {/* SIDE D */}

        <Side rotation={[0, Math.PI / 2, -Math.PI / 2]} bg="aquamarine" index={3}>
          <octahedronGeometry />
        </Side>

    {/* SIDE E */}
        <Side rotation={[0, -Math.PI / 2, 0]} bg="indianred" index={4}>
          <icosahedronGeometry />
        </Side>

    {/* SIDE F */}

        <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
          <dodecahedronGeometry />
        </Side>
      </mesh>
    </PivotControls>
    <CameraControls makeDefault />
  </Canvas>
);

function Side({ rotation = [0, 0, 0], bg = '#000', children, index }) {
  const mesh = useRef();
  const { worldUnits } = useControls({ worldUnits: false });
  const { nodes } = useGLTF('/aobox-transformed.glb');
  // useFrame((state, delta) => {
  //   mesh.current.rotation.x = mesh.current.rotation.y += delta;
  // });
  return (
    <MeshPortalMaterial worldUnits={worldUnits} attach={`material-${index}`}>
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.1} />
      <Environment preset="city" />


      {/** A box with baked AO */}
      <mesh castShadow receiveShadow rotation={rotation} geometry={nodes.Cube.geometry}>
        <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} color={bg} />
        <spotLight castShadow color={bg} intensity={0.10} position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-normalBias={0.05} shadow-bias={0.0001} />
      </mesh>
      {/** The shape */}
      <mesh castShadow receiveShadow ref={mesh}>
        {children}
        <meshLambertMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  );
}

function MitchMadeA() {
  const { scene } = useGLTF('/modelA.gltf');
  return <primitive object={scene} />;
}

// Don't forget to preload your GLTF file
useGLTF.preload('/modelA.gltf');
