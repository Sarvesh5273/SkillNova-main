"use client";

import { useRef, useEffect, useState } from "react";
import { SkillNode } from "./skill-node";
import { useRouter } from "next/navigation";

// Define the shape of our data
interface MapNode {
  id: string;
  title: string;
  status: "LOCKED" | "ACTIVE" | "COMPLETED";
  x: number;
  y: number;
  isBoss: boolean;
}

export function MapView({ nodes }: { nodes: MapNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const router = useRouter();

  // Handle Window Resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleNodeClick = (node: MapNode) => {
    if (node.isBoss) {
        router.push("/arena");
    } else {
        // Pass the Node ID so the cockpit knows which video to load
        router.push(`/cockpit?nodeId=${node.id}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[150vh] md:h-[120vh] overflow-hidden">
      
      {/* SVG CONNECTIONS */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
        {nodes.map((node, i) => {
          if (i === nodes.length - 1) return null;
          const nextNode = nodes[i + 1];
          
          const x1 = (node.x / 100) * dimensions.w;
          const y1 = (node.y / 100) * dimensions.h;
          const x2 = (nextNode.x / 100) * dimensions.w;
          const y2 = (nextNode.y / 100) * dimensions.h;

          const isPathLit = node.status === "COMPLETED";

          return (
            <line
              key={`line-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isPathLit ? "#C6FF3A" : "#333"} 
              strokeWidth={isPathLit ? "6" : "4"}
              strokeDasharray={isPathLit ? "0" : "12,12"} 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out shadow-lg"
            />
          );
        })}
      </svg>

      {/* PLANETS */}
      {nodes.map((node) => (
        <SkillNode
          key={node.id}
          id={node.id}
          title={node.title}
          status={node.status}
          x={node.x}
          y={node.y}
          onClick={() => handleNodeClick(node)}
        />
      ))}
    </div>
  );
}