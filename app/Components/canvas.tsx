import { useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new FabricCanvas(canvasRef.current, {
        width: 1555,
        height: 763,
      });

      initCanvas.backgroundColor = 'white';
      initCanvas.renderAll();
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}