
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, OrbitControls, Environment, PointerLockControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

// Casino floor component
const CasinoFloor = () => {
  const texture = useTexture('/textures/casino-carpet.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        map={texture} 
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
};

// Casino building component
const CasinoBuilding = () => {
  const wallTexture = useTexture('/textures/wall.jpg');
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(5, 2);
  
  return (
    <group>
      {/* Casino main structure */}
      <mesh position={[0, 10, 0]} castShadow receiveShadow>
        <boxGeometry args={[40, 20, 40]} />
        <meshStandardMaterial 
          map={wallTexture}
          metalness={0.2}
          roughness={0.7}
          color="#220033" 
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Entrance */}
      <mesh position={[0, 5, 20.1]} castShadow>
        <boxGeometry args={[10, 10, 0.5]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Casino sign */}
      <Text
        position={[0, 21, 0]}
        rotation={[0, Math.PI / 4, 0]}
        fontSize={3}
        color="#ff00ff"
        font="/fonts/Inter-Bold.woff"
        maxWidth={40}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
      >
        MEME Casino Metaverse
      </Text>
    </group>
  );
};

// Slot machine component
const SlotMachine = ({ position, rotation, onClick }: { position: [number, number, number], rotation: [number, number, number], onClick: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh
      position={position}
      rotation={rotation}
      ref={meshRef}
      castShadow
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 4, 1.5]} />
      <meshStandardMaterial color={hovered ? "#8B5CF6" : "#6d28d9"} />
      
      {/* Slot machine screen */}
      <mesh position={[0, 0.5, 0.76]}>
        <planeGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      
      {/* Slot machine lever */}
      <mesh position={[1.1, 0, 0]} rotation={[0, 0, hovered ? -0.5 : 0]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </mesh>
  );
};

// Player controls
const PlayerControls = () => {
  const { camera } = useThree();
  const controls = useRef<any>();
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 5, 25);
  }, [camera]);
  
  return <PointerLockControls ref={controls} />;
};

// Main World component
const World: React.FC = () => {
  const navigate = useNavigate();
  const [slotMachineActive, setSlotMachineActive] = useState(false);
  
  const openSlotMachine = () => {
    setSlotMachineActive(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };
  
  return (
    <div className="relative w-full h-screen">
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }}>
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#ff00ff" />
        
        {/* Environment */}
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
        <Environment preset="night" />
        
        {/* Casino elements */}
        <CasinoFloor />
        <CasinoBuilding />
        
        {/* Slot machines */}
        <SlotMachine position={[-5, 2, 10]} rotation={[0, 0.5, 0]} onClick={openSlotMachine} />
        <SlotMachine position={[0, 2, 10]} rotation={[0, 0, 0]} onClick={openSlotMachine} />
        <SlotMachine position={[5, 2, 10]} rotation={[0, -0.5, 0]} onClick={openSlotMachine} />
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true} 
          minDistance={5} 
          maxDistance={50}
          maxPolarAngle={Math.PI / 2 - 0.1} 
        />
      </Canvas>
      
      {/* UI overlay */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          className="bg-black/50 backdrop-blur-sm text-white"
          onClick={() => navigate('/')}
        >
          Exit 3D World
        </Button>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg">
        Use mouse to look around. Click on a slot machine to play.
      </div>
    </div>
  );
};

export default World;
