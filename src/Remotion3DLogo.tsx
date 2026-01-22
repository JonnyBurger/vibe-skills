import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React, { useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const REMOTION_SVG = `<svg width="988" height="317" viewBox="0 0 988 317" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_9_8)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M988 158.5C988 200.537 935.954 240.852 843.311 270.576C750.668 300.301 625.017 317 494 317C362.983 317 237.332 300.301 144.689 270.576C52.0463 240.852 0 200.537 0 158.5C0 116.463 52.0463 76.1481 144.689 46.4236C237.332 16.6991 362.983 0 494 0C625.017 0 750.668 16.6991 843.311 46.4236C935.954 76.1481 988 116.463 988 158.5ZM940 158.5C940 120.176 893.011 83.4221 809.37 56.3231C725.728 29.2241 612.287 14 494 14C375.713 14 262.272 29.2241 178.63 56.3231C94.9891 83.4221 48 120.176 48 158.5C48 196.824 94.9891 233.578 178.63 260.677C262.272 287.776 375.713 303 494 303C612.287 303 725.728 287.776 809.37 260.677C893.011 233.578 940 196.824 940 158.5Z" fill="black"/>
<path d="M120.918 209L142.644 106.949H193.44C203.997 106.949 210.423 108.02 214.707 110.315C220.215 113.375 223.122 118.73 223.122 125.615C223.122 135.713 218.532 152.237 214.095 158.51C210.423 163.559 206.292 165.701 196.347 167.843L196.194 168.608C205.986 169.22 210.729 173.657 210.729 181.919C210.729 184.061 210.576 185.438 209.811 188.651L205.527 209H181.659L185.025 193.088C185.637 190.487 185.79 188.804 185.79 186.968C185.79 181.001 182.577 178.553 174.774 178.553H151.059L144.48 209H120.918ZM155.19 158.51H179.67C187.779 158.51 191.757 156.368 194.205 150.554C195.582 147.647 197.724 137.396 197.724 134.489C197.724 128.828 195.123 127.145 186.249 127.145H161.922L155.19 158.51ZM258.674 126.38L253.931 148.718H299.372L295.853 165.395H250.412L245.21 189.569H294.17L290.039 209H217.517L239.243 106.949H311L306.869 126.38H258.674ZM445.852 106.949L424.126 209H400.87L410.05 166.16C411.733 158.051 412.651 154.379 417.241 136.784L419.842 126.992H419.077L414.181 136.478C405.46 153.002 403.165 157.286 398.881 164.63L373.177 209H352.522L345.331 164.783C344.107 156.98 343.648 153.614 341.812 136.631L340.894 127.298H340.129L338.599 136.937C335.845 154.532 335.08 159.275 333.55 166.16L324.523 209H301.267L322.993 106.949H360.172L365.833 145.046C366.751 151.319 367.057 154.379 368.434 168.761L369.046 176.717H369.964L373.942 168.761C380.827 154.838 382.663 151.319 386.182 145.199L407.755 106.949H445.852ZM504.916 106.184C518.533 106.184 525.112 107.102 530.467 109.703C538.882 113.681 542.86 120.566 542.86 131.276C542.86 139.844 536.434 171.515 532.609 181.766C528.019 193.853 521.899 200.891 511.801 205.328C504.457 208.541 495.736 209.765 480.13 209.765C464.83 209.765 458.251 208.694 452.131 205.481C444.94 201.503 441.268 194.771 441.268 184.979C441.268 175.799 447.541 145.505 451.978 133.724C456.415 121.79 462.382 115.364 473.092 110.468C480.436 107.255 488.392 106.184 504.916 106.184ZM498.49 126.38C485.332 126.38 481.201 127.604 477.376 132.806C474.622 136.631 473.551 139.844 470.032 155.909C466.972 169.832 466.054 175.34 466.054 179.012C466.054 188.039 469.114 189.569 486.709 189.569C502.927 189.569 507.058 186.662 511.342 171.821C513.79 163.1 518.074 141.374 518.074 137.09C518.074 132.194 516.697 129.44 513.637 128.063C510.883 126.686 507.823 126.38 498.49 126.38ZM595.854 127.298L578.412 209H554.85L572.139 127.298H544.599L548.883 106.949H629.055L624.618 127.298H595.854ZM655.328 106.949L633.602 209H610.04L631.766 106.949H655.328ZM714.478 106.184C728.095 106.184 734.674 107.102 740.029 109.703C748.444 113.681 752.422 120.566 752.422 131.276C752.422 139.844 745.996 171.515 742.171 181.766C737.581 193.853 731.461 200.891 721.363 205.328C714.019 208.541 705.298 209.765 689.692 209.765C674.392 209.765 667.813 208.694 661.693 205.481C654.502 201.503 650.83 194.771 650.83 184.979C650.83 175.799 657.103 145.505 661.54 133.724C665.977 121.79 671.944 115.364 682.654 110.468C689.998 107.255 697.954 106.184 714.478 106.184ZM708.052 126.38C694.894 126.38 690.763 127.604 686.938 132.806C684.184 136.631 683.113 139.844 679.594 155.909C676.534 169.832 675.616 175.34 675.616 179.012C675.616 188.039 678.676 189.569 696.271 189.569C712.489 189.569 716.62 186.662 720.904 171.821C723.352 163.1 727.636 141.374 727.636 137.09C727.636 132.194 726.259 129.44 723.199 128.063C720.445 126.686 717.385 126.38 708.052 126.38ZM868.06 106.949L846.334 209H806.554L794.467 159.581C793.09 153.767 792.478 150.248 789.877 135.254L788.347 127.145H787.429C784.981 141.221 782.992 152.084 781.462 159.581L771.058 209H747.955L769.681 106.949H809.155L820.324 154.226C823.078 165.701 823.078 165.854 827.362 188.192H828.28L829.657 180.236C831.646 168.761 831.799 167.231 834.094 156.521L844.651 106.949H868.06Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_9_8">
<rect width="988" height="317" fill="white"/>
</clipPath>
</defs>
</svg>`;

const ExtrudedSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const geometry = useMemo(() => {
    const loader = new SVGLoader();
    const svgData = loader.parse(REMOTION_SVG);
    const shapes: THREE.Shape[] = [];

    svgData.paths.forEach((path) => {
      const pathShapes = SVGLoader.createShapes(path);
      shapes.push(...pathShapes);
    });

    const extrudeSettings = {
      depth: 30,
      bevelEnabled: true,
      bevelThickness: 3,
      bevelSize: 2,
      bevelOffset: 0,
      bevelSegments: 8,
    };

    const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    geometry.center();

    return geometry;
  }, []);

  // Animated rotation driven by useCurrentFrame()
  const rotationY = interpolate(frame, [0, 300], [0, Math.PI * 2], {
    extrapolateRight: "extend",
  });

  const rotationX = interpolate(frame, [0, 200], [-0.2, 0.2], {
    extrapolateRight: "clamp",
  });

  // Spring animation for scale on entry
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  return (
    <group scale={[scale * 0.008, -scale * 0.008, scale * 0.008]} rotation={[rotationX, rotationY, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
};

export const Remotion3DLogo: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Animate light position based on frame
  const lightX = interpolate(frame, [0, 150], [10, -10], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ backgroundColor: "#0a0a1a" }}>
      <ThreeCanvas width={width} height={height}>
        {/* Camera positioning */}
        <perspectiveCamera position={[0, 0, 15]} />

        {/* Balanced lighting for metallic silver appearance */}
        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#ffffff", "#666666", 0.8]} />
        <directionalLight position={[lightX, 5, 10]} intensity={2} color="#ffffff" />
        <directionalLight position={[-8, 3, 8]} intensity={1.5} color="#f0f0ff" />
        <directionalLight position={[0, -5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, 5, 5]} intensity={1} color="#ffffff" />

        {/* The 3D extruded SVG */}
        <ExtrudedSVG />
      </ThreeCanvas>
    </div>
  );
};
