'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DraggableCardProps {
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  className?: string;
}

export default function DraggableCard({
  children,
  className = ''
}: DraggableCardProps) {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignore drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [data-no-drag]')) {
      return;
    }

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setPosition({
        x: dragStartRef.current.posX + dx,
        y: dragStartRef.current.posY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    willChange: 'transform'
  };

  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      className={`transition-shadow select-none ${isDragging ? 'cursor-grabbing shadow-2xl scale-[1.01]' : 'cursor-grab'} ${className}`}
    >
      {children}
    </div>
  );
}
