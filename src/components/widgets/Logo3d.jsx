import React, { Suspense, useRef } from 'react';
import { useGLTF, OrbitControls, Environment, Float, Html } from '@react-three/drei';
import { useFrame, Canvas } from '@react-three/fiber';

function SympoLogo() {
  return (
    <div className='w-screen h-screen' style={{
      height: "50vh"
    }}>
      <Canvas
        camera={{
          position: [0, 0, 4]
        }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2 - Math.PI * 0.1}
          maxPolarAngle={Math.PI / 2 + Math.PI * 0.1}
        />
        <Environment preset='forest'  background backgroundIntensity={0.5} backgroundBlurriness={0.08}/>
        <ambientLight intensity={15} color={"green"} />

        <Suspense fallback={
          <Html>
            <img src="/images/pictures/finallogo.png" alt="main-logo" className="img-fluid" />
          </Html>
        }>
          <Float
            speed={5}
            rotationIntensity={0.5}
            floatIntensity={4}
            floatingRange={[0.1, -0.1]}
          >
            <Logo />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Logo(props) {
  const { nodes, materials } = useGLTF('models/model-draco.glb');
  const meshRef = useRef();

  useFrame(({ pointer }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = pointer.x * 0.5;
    }
  });
  return (
    <group position={[0, 0, 0]} scale={4} rotation-y={Math.PI * 0.5}>
      <mesh
        // ref={meshRef}
        receiveShadow
        geometry={nodes['tripo_node_110ac5ce-d42b-4bc0-8254-40f1258a77a1'].geometry}
      >
        <meshPhysicalMaterial
          metalness={0.9}
          roughness={0.1}
          color="silver"
          clearcoat={1}
          reflectivity={1}
        />
      </mesh>
    </group>
  )
}
useGLTF.preload('models/model-draco.glb')

export default SympoLogo;
