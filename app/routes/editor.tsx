import { Viewer, Worker } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { useLocation } from "react-router";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import Toolbar from "~/Components/Toolbar";
import { Canvas as FabricCanvas } from "fabric";


export default function Editor() {
  const location = useLocation();
  const [fileUrl, setFileUrl] = useState(location.state?.fileUrl);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new FabricCanvas(canvasRef.current, {
        width: 794,
        height: 1123,
      });

      initCanvas.backgroundColor = "white";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (fileUrl) return;

    const createBlankPdf = async () => {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([595, 842]);
      const pdfBytes = await pdfDoc.save();
      const newBlob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const newUrl = URL.createObjectURL(newBlob);
      setFileUrl(newUrl);
    };

    createBlankPdf().catch((err) => {
      console.error("Failed to create blank PDF", err);
    });
  }, [fileUrl]);

  const plugin = thumbnailPlugin();
  const { Thumbnails } = plugin;

  const addPage = async () => {
    if (!fileUrl) return;

    const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.addPage([595, 842]);

    const pdfBytes = await pdfDoc.save();

    const newBlob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    const newUrl = URL.createObjectURL(newBlob);

    setFileUrl(newUrl);
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {fileUrl && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div className="flex">
                <div className="w-48 bg-white rounded-r-md border-r-2 flex-shrink-0 sticky top-24 max-h-[calc(100vh-6rem)] border-gray-300 overflow-y-auto p-2">
                  <Thumbnails />
                </div>

                <div className="flex-1 overflow-hidden relative ml-4">
                  <Viewer
                    fileUrl={fileUrl}
                    plugins={[plugin]}
                  />

                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 pointer-events-none"
                  />
                </div>

              </div>
            </Worker>
          )}
        </div>
      </div>
      <Toolbar canvas={canvas} onAddPage={addPage} />

    </div>
  );
}