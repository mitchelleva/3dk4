import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Edges, MeshPortalMaterial, CameraControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

export const App = () => (
  <Canvas shadows camera={{ position: [-3, 0.5, 3] }}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <Edges />

      {/*----- SIDE 1 BACK LEFT */}
      <Side rotation={[0, 0, 0]} bg="#D3E6FF" index={0} url='/side1.gltf' />

      {/*----- SIDE 2 FRONT LEFT*/}
      <Side rotation={[0, Math.PI, 0]} bg="#E4C7FF" index={1} url='/side2.gltf' />

      {/*----- SIDE 3 TOP */}
      <Side rotation={[0, Math.PI / 2, Math.PI / 2]} bg="#FFD0D0" index={2} url='/side3.gltf' />

      {/*----- SIDE 4 BOTTOM */}
      <Side rotation={[0, Math.PI / 2, -Math.PI / 2]} bg="#C7FFC1" index={3} url='/side4.gltf' />

      {/*----- SIDE 5 FRONT RIGHT */}
      <Side rotation={[0, -Math.PI / 2, 0]} bg="#C6FFF7" index={4} url='/side5.gltf' />

      {/*----- SIDE 6 BACK RIGHT */}
      <Side rotation={[0, Math.PI / 2, 0]} bg="#FEFFBB" index={5} url='/side6.gltf' />
    </mesh>
    <CameraControls makeDefault />
  </Canvas>
);

function Side({ rotation = [0, 0, 0], bg = '#fff', url, index }) {
  const mesh = useRef();
  const { nodes } = useGLTF('/aobox-transformed.glb');
  const { scene, animations } = useGLTF(url);
  const mixerRef = useRef();

  useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      const action = mixer.clipAction(animations[0]);
      action.setLoop(THREE.LoopRepeat);
      action.play();
      mixerRef.current = mixer;
    }
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [animations, scene]);

  useEffect(() => {
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      if (mixerRef.current) {
        mixerRef.current.update(clock.getDelta());
      }
    };
    animate();
  }, []);

  return (
    <MeshPortalMaterial attach={`material-${index}`}>
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      {/* A box with baked AO */}
      <mesh castShadow receiveShadow rotation={rotation} geometry={nodes.Cube.geometry}>
        <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} color={bg} />
        <spotLight castShadow color={bg} intensity={0.50} position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-normalBias={0.05} shadow-bias={0.001} />
      </mesh>

      {/* The shape */}
      <mesh castShadow receiveShadow ref={mesh}>
        <primitive object={scene} />
        <meshLambertMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  );
}

// Preload GLTF files dynamically
const urls = ['/side1.gltf', '/side2.gltf', '/side3.gltf', '/side4.gltf', '/side5.gltf', '/side6.gltf'];
urls.forEach(url => useGLTF.preload(url));
