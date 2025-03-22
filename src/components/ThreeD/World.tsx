
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, OrbitControls, Environment, PointerLockControls, Text, useTexture, useGLTF, Plane, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

// Fantasy terrain component
const FantasyTerrain = () => {
  const texture = useTexture('/textures/casino-carpet.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);
  
  return (
    <group>
      {/* Main terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 32, 32]} />
        <meshStandardMaterial 
          map={texture} 
          metalness={0.1}
          roughness={0.8}
          color="#3a6e32"
          displacementScale={2}
        />
      </mesh>
      
      {/* Fantasy stone paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 10]} receiveShadow>
        <planeGeometry args={[8, 20]} />
        <meshStandardMaterial 
          color="#8E9196" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// Fantasy building component
const FantasyBuilding = () => {
  const wallTexture = useTexture('/textures/wall.jpg');
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(5, 2);
  
  return (
    <group>
      {/* Main building structure - Medieval Castle style */}
      <mesh position={[0, 10, 0]} castShadow receiveShadow>
        <boxGeometry args={[40, 20, 40]} />
        <meshStandardMaterial 
          map={wallTexture}
          metalness={0.2}
          roughness={0.7}
          color="#8A898C" 
        />
      </mesh>
      
      {/* Castle turrets */}
      {[[-20, 10, -20], [20, 10, -20], [-20, 10, 20], [20, 10, 20]].map((position, i) => (
        <group key={i} position={position}>
          <mesh castShadow receiveShadow position={[0, 5, 0]}>
            <cylinderGeometry args={[5, 5, 30, 16]} />
            <meshStandardMaterial map={wallTexture} color="#6E59A5" />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 22, 0]}>
            <coneGeometry args={[6, 8, 16]} />
            <meshStandardMaterial color="#403E43" />
          </mesh>
        </group>
      ))}
      
      {/* Fantasy entrance */}
      <mesh position={[0, 5, 20.1]} castShadow>
        <boxGeometry args={[10, 10, 0.5]} />
        <meshStandardMaterial color="#221F26" />
      </mesh>
      
      {/* Arch over entrance */}
      <mesh position={[0, 11, 20.1]} castShadow>
        <cylinderGeometry args={[5, 5, 2, 16, 1, true, 0, Math.PI]} rotation={[Math.PI/2, 0, 0]} />
        <meshStandardMaterial color="#7E69AB" />
      </mesh>
      
      {/* Flags on turrets */}
      {[[-20, 26, -20], [20, 26, -20], [-20, 26, 20], [20, 26, 20]].map((position, i) => (
        <group key={i} position={position}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 6, 0.5]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[1.5, -1, 0]} castShadow>
            <planeGeometry args={[3, 2]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#9b87f5" : "#6E59A5"} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      
      {/* Fantasy guild sign */}
      <Text
        position={[0, 21, 0]}
        rotation={[0, Math.PI / 4, 0]}
        fontSize={3}
        color="#D6BCFA"
        font="/fonts/Inter-Bold.woff"
        maxWidth={40}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
      >
        MEME Guild Hall
      </Text>
    </group>
  );
};

// Magical object - replaces slot machine
const MagicalRelic = ({ position, rotation, onClick }: { position: [number, number, number], rotation: [number, number, number], onClick: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      // Floating animation
      if (hovered) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    }
  });
  
  return (
    <group position={position} rotation={rotation}>
      {/* Magical relic pedestal */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.5, 1, 8]} />
        <meshStandardMaterial color="#8E9196" />
      </mesh>
      
      {/* Magical relic */}
      <mesh
        position={[0, 1.5, 0]}
        ref={meshRef}
        castShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color={hovered ? "#9b87f5" : "#7E69AB"} 
          emissive={hovered ? "#9b87f5" : "#6E59A5"}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
        
        {/* Magical particles */}
        {hovered && Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[
            Math.sin(i/8 * Math.PI * 2) * 1.5,
            Math.cos(i/8 * Math.PI * 2) * 1.5,
            0
          ]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color="#D6BCFA" 
              emissive="#D6BCFA"
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </mesh>
    </group>
  );
};

// Floating crystals
const FloatingCrystals = () => {
  const crystals = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (crystals.current) {
      crystals.current.rotation.y = clock.getElapsedTime() * 0.1;
      crystals.current.children.forEach((child, i) => {
        // @ts-ignore - position is available on Object3D
        child.position.y += Math.sin(clock.getElapsedTime() * 1 + i) * 0.01;
      });
    }
  });
  
  return (
    <group ref={crystals}>
      {Array.from({ length: 15 }).map((_, i) => {
        const radius = 30;
        const angle = (i / 15) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <mesh key={i} position={[x, 10 + Math.random() * 10, z]} castShadow>
            <tetrahedronGeometry args={[1 + Math.random(), 0]} />
            <meshStandardMaterial 
              color="#9b87f5"
              emissive="#6E59A5"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
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
  const [magicActive, setMagicActive] = useState(false);
  
  const activateMagic = () => {
    setMagicActive(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };
  
  return (
    <div className="relative w-full h-screen">
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }}>
        {/* Fantasy sky and environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.1} azimuth={0.25} />
        <Environment preset="night" />
        <fog attach="fog" args={['#1A1F2C', 30, 95]} />
        
        {/* Scene lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 20, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        <pointLight position={[0, 15, 0]} intensity={0.5} color="#9b87f5" distance={50} />
        
        {/* Fantasy world elements */}
        <FantasyTerrain />
        <FantasyBuilding />
        <FloatingCrystals />
        
        {/* Magical relics (replacing slot machines) */}
        <MagicalRelic position={[-10, 2, 10]} rotation={[0, 0.5, 0]} onClick={activateMagic} />
        <MagicalRelic position={[0, 2, 10]} rotation={[0, 0, 0]} onClick={activateMagic} />
        <MagicalRelic position={[10, 2, 10]} rotation={[0, -0.5, 0]} onClick={activateMagic} />
        
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
          Exit Magical Realm
        </Button>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg">
        Use mouse to look around. Click on a magical relic to activate its power.
      </div>
    </div>
  );
};

export default World;
