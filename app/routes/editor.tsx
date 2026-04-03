import { Viewer, Worker } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { useLocation } from "react-router";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import Toolbar from "~/Components/Toolbar";

import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text,
  Image as KonvaImage,
} from "react-konva";

export default function Editor() {
  const location = useLocation();
  const [fileUrl, setFileUrl] = useState(location.state?.fileUrl);

  const plugin = thumbnailPlugin();
  const { Thumbnails } = plugin;

  const stageRef = useRef<any>(null);

  // ✅ PER PAGE STATE
  const [pages, setPages] = useState<any[][]>([[]]);
  const [currentPage, setCurrentPage] = useState(0);

  const [tool, setTool] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);

  useEffect(() => {
    if (fileUrl) return;

    (async () => {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([595, 842]);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setFileUrl(URL.createObjectURL(blob));
    })();
  }, [fileUrl]);

  const updateCurrentPage = (newElements: any[]) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[currentPage] = newElements;
      return copy;
    });
  };

  const handleMouseDown = (e: any) => {
    if (tool !== "draw") return;

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();

    updateCurrentPage([
      ...(pages[currentPage] || []),
      {
        type: "line",
        points: [pos.x, pos.y],
        stroke: "black",
        strokeWidth: 2,
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const point = e.target.getStage().getPointerPosition();
    const current = pages[currentPage] || [];
    const last = current[current.length - 1];

    if (!last) return;

    last.points = last.points.concat([point.x, point.y]);

    updateCurrentPage([...current.slice(0, -1), last]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTextChange = (text: string) => {
    if (selectedIndex !== null) {
      updateElement(selectedIndex, { text });
    }
  };

  const selectedText =
    selectedIndex !== null && (pages[currentPage] || [])[selectedIndex]?.type === "text"
      ? (pages[currentPage] || [])[selectedIndex].text
      : null;

  const updateElement = (index: number, updates: any) => {
    const current = pages[currentPage] || [];
    const updated = [...current];
    updated[index] = { ...updated[index], ...updates };
    updateCurrentPage(updated);
  };

  const addText = () => {
    setTool("text");
    updateCurrentPage([
      ...(pages[currentPage] || []),
      { type: "text", x: 100, y: 100, text: "Edit me", fontSize: 20 },
    ]);
  };

  const addRect = () => {
    setTool("rect");
    updateCurrentPage([
      ...(pages[currentPage] || []),
      { type: "rect", x: 100, y: 100, width: 100, height: 100, fill: "blue" },
    ]);
  };

  const addCircle = () => {
    setTool("circle");
    updateCurrentPage([
      ...(pages[currentPage] || []),
      { type: "circle", x: 150, y: 150, radius: 50, fill: "green" },
    ]);
  };

  const addTriangle = () => {
    setTool("triangle");
    updateCurrentPage([
      ...(pages[currentPage] || []),
      {
        type: "line",
        points: [200, 200, 250, 300, 150, 300, 200, 200],
        fill: "purple",
        closed: true,
      },
    ]);
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = url;

    img.onload = () => {
      updateCurrentPage([
        ...(pages[currentPage] || []),
        {
          type: "image",
          image: img,
          x: 100,
          y: 100,
          width: 150,
          height: 150,
        },
      ]);
    };
  };

  const eraseLast = () => {
    const current = pages[currentPage] || [];
    updateCurrentPage(current.slice(0, -1));
  };

  const exportPdf = async () => {
    if (!fileUrl) return;

    const bytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(bytes);

    const pdfPages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const uri = stageRef.current.toDataURL();
      const pngBytes = await fetch(uri).then((res) => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(pngBytes);

      const page = pdfPages[i];

      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
    }

    const finalBytes = await pdfDoc.save();
    const blob = new Blob([finalBytes], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited.pdf";
    link.click();
  };

  const addPage = async () => {
    if (!fileUrl) return;

    const bytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(bytes);

    pdfDoc.addPage([595, 842]);

    const newBytes = await pdfDoc.save();
    setFileUrl(URL.createObjectURL(new Blob([newBytes])));

    setPages((prev) => [...prev, []]);
  };

  const handlePageChange = (e: any) => {
    const pageIndex = e.currentPage;

    setCurrentPage(pageIndex);

    setPages((prev) => {
      if (!prev[pageIndex]) {
        const copy = [...prev];
        copy[pageIndex] = [];
        return copy;
      }
      return prev;
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toolbar
        onText={addText}
        onDraw={() => setTool("draw")}
        onRect={addRect}
        onCircle={addCircle}
        onTriangle={addTriangle}
        onImageUpload={handleImageUpload}
        onErase={eraseLast}
        onAddPage={addPage}
        onExport={exportPdf}
        selectedText={selectedText}
        onTextChange={handleTextChange}
      />

      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {fileUrl && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div className="flex gap-4">
                <div className="w-48 bg-white border-r p-2 h-fit">
                  <Thumbnails />
                </div>

                <div className="flex-1 relative">
                  <Viewer
                    fileUrl={fileUrl}
                    plugins={[plugin]}
                    onPageChange={handlePageChange}
                  />

                  <Stage
                    key={currentPage}
                    width={595}
                    height={842}
                    ref={stageRef}
                    className="absolute top-0 left-0 z-10"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  >
                    <Layer>
                      {(pages[currentPage] || []).map((el, i) => {
                        switch (el.type) {
                          case "rect":
                            return (
                              <Rect
                                key={i}
                                {...el}
                                draggable
                                onClick={() => setSelectedIndex(i)}
                                onDragEnd={(e) =>
                                  updateElement(i, {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                  })
                                }
                              />
                            );
                          case "circle":
                            return (
                              <Circle
                                key={i}
                                {...el}
                                draggable
                                onClick={() => setSelectedIndex(i)}
                                onDragEnd={(e) =>
                                  updateElement(i, {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                  })
                                }
                              />
                            );
                          case "text":
                            return (
                              <Text
                                key={i}
                                {...el}
                                draggable
                                onClick={() => setSelectedIndex(i)}
                                onDragEnd={(e) =>
                                  updateElement(i, {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                  })
                                }
                              />
                            );
                          case "line":
                            return <Line key={i} {...el} />;
                          case "image":
                            return (
                              <KonvaImage
                                key={i}
                                {...el}
                                draggable
                                onClick={() => setSelectedIndex(i)}
                                onDragEnd={(e) =>
                                  updateElement(i, {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                  })
                                }
                              />
                            );
                          default:
                            return null;
                        }
                      })}
                    </Layer>
                  </Stage>
                </div>

                {selectedIndex !== null && (pages[currentPage] || [])[selectedIndex] && (
                  <div className="w-56 bg-white border-l p-4 h-fit">
                    <h3 className="font-bold text-sm mb-4">Properties</h3>
                    {(() => {
                      const el = (pages[currentPage] || [])[selectedIndex];
                      if (!el) return null;

                      if (el.type === "rect") {
                        return (
                          <div className="space-y-3 text-sm">
                            <div>
                              <label className="block text-gray-600 mb-1">
                                Width
                              </label>
                              <input
                                type="number"
                                value={el.width || 100}
                                onChange={(e) =>
                                  updateElement(selectedIndex, {
                                    width: parseInt(e.target.value),
                                  })
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">
                                Height
                              </label>
                              <input
                                type="number"
                                value={el.height || 100}
                                onChange={(e) =>
                                  updateElement(selectedIndex, {
                                    height: parseInt(e.target.value),
                                  })
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        );
                      } else if (el.type === "circle") {
                        return (
                          <div className="space-y-3 text-sm">
                            <div>
                              <label className="block text-gray-600 mb-1">
                                Radius
                              </label>
                              <input
                                type="number"
                                value={el.radius || 50}
                                onChange={(e) =>
                                  updateElement(selectedIndex, {
                                    radius: parseInt(e.target.value),
                                  })
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        );
                      } else if (el.type === "text") {
                        return (
                          <div className="space-y-3 text-sm">
                            <p className="text-gray-600">Edit text in the toolbar above.</p>
                          </div>
                        );
                      } else if (el.type === "image") {
                        return (
                          <div className="space-y-3 text-sm">
                            <div>
                              <label className="block text-gray-600 mb-1">
                                Width
                              </label>
                              <input
                                type="number"
                                value={el.width || 150}
                                onChange={(e) =>
                                  updateElement(selectedIndex, {
                                    width: parseInt(e.target.value),
                                  })
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">
                                Height
                              </label>
                              <input
                                type="number"
                                value={el.height || 150}
                                onChange={(e) =>
                                  updateElement(selectedIndex, {
                                    height: parseInt(e.target.value),
                                  })
                                }
                                className="w-full border rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
            </Worker>
          )}
        </div>
      </div>
    </div>
  );
}