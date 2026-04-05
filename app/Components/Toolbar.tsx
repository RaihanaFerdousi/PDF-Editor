import React, { useState } from "react";
import {
  Type,
  Pencil,
  Shapes,
  ImagePlus,
  Palette,
  Eraser,
  PlusSquare,
  Download,
  Square,
  Star,
  ChevronDown,
} from "lucide-react";
import { RiTriangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";

interface ToolbarProps {
  onAddPage?: () => void;
  onExport?: () => void;
}

const ToolGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1 px-4 border-r border-gray-200 last:border-r-0">
    {children}
  </div>
);

const ToolButton = ({ icon: Icon, label, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
  >
    <Icon size={20} />
    <span className="text-[11px] font-medium mt-1.5">{label}</span>
  </button>
);

export default function Toolbar({ onAddPage, onExport }: ToolbarProps) {
  const [isShapesOpen, setIsShapesOpen] = useState(false);


  const enableTextEdit = () => {
    document.querySelectorAll(".pdf-html span").forEach((el) => {
      (el as HTMLElement).contentEditable = "true";
    });
  };

  const createShape = (styles: Partial<CSSStyleDeclaration>) => {
    const layer = document.getElementById("draw-layer");
    if (!layer) return;

    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.left = "100px";
    el.style.top = "100px";
    el.style.cursor = "move";

    Object.assign(el.style, styles);

    el.onmousedown = (e) => {
      e.preventDefault();
      const shiftX = e.clientX - el.getBoundingClientRect().left;
      const shiftY = e.clientY - el.getBoundingClientRect().top;

      const move = (e: MouseEvent) => {
        el.style.left = e.pageX - shiftX + "px";
        el.style.top = e.pageY - shiftY + "px";
      };

      document.addEventListener("mousemove", move);
      document.onmouseup = () => {
        document.removeEventListener("mousemove", move);
      };
    };

    layer.appendChild(el);
  };

  const addRectangle = () => {
    createShape({
      width: "100px",
      height: "100px",
      background: "rgba(0,0,255,0.3)",
      border: "2px solid blue",
    });
  };

  const addCircle = () => {
    createShape({
      width: "100px",
      height: "100px",
      background: "rgba(0,255,0,0.3)",
      borderRadius: "50%",
      border: "2px solid green",
    });
  };

  const addTriangle = () => {
    const layer = document.getElementById("draw-layer");
    if (!layer) return;

    const triangle = document.createElement("div");
    triangle.style.position = "absolute";
    triangle.style.left = "100px";
    triangle.style.top = "100px";
    triangle.style.width = "0";
    triangle.style.height = "0";
    triangle.style.borderLeft = "50px solid transparent";
    triangle.style.borderRight = "50px solid transparent";
    triangle.style.borderBottom = "100px solid purple";
    triangle.style.cursor = "move";

    layer.appendChild(triangle);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 select-none">
      <div className="flex items-center justify-between px-6 h-20">
        <div className="flex items-center">
          <ToolGroup>
            <ToolButton icon={Type} label="Text" onClick={enableTextEdit} />
            <ToolButton icon={Pencil} label="Free Draw" />

            <div className="relative">
              <button
                onClick={() => setIsShapesOpen(!isShapesOpen)}
                className={`flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg ${
                  isShapesOpen
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <Shapes size={20} />
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${
                      isShapesOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <span className="text-[11px] mt-1.5">Shapes</span>
              </button>

              {isShapesOpen && (
                <div className="absolute top-full mt-2 left-0 w-40 bg-white border rounded-xl shadow-xl p-2 z-50">
                  <button onClick={addRectangle} className="btn">
                    <Square size={16} /> Square
                  </button>

                  <button onClick={addCircle} className="btn">
                    <FaRegCircle className="w-4 h-4" /> Circle
                  </button>

                  <button onClick={addTriangle} className="btn">
                    <RiTriangleLine className="w-4 h-4" /> Triangle
                  </button>

                  <button onClick={addRectangle} className="btn">
                    <Star size={16} /> Star
                  </button>
                </div>
              )}
            </div>

            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg text-gray-500 hover:bg-gray-100">
                <ImagePlus size={20} />
                <span className="text-[11px] mt-1.5">Img upload</span>
              </div>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </ToolGroup>

          <ToolGroup>
            <ToolButton icon={Palette} label="Color" />
            <ToolButton icon={Eraser} label="Eraser" />
          </ToolGroup>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onAddPage}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
          >
            <PlusSquare size={18} />
            Add Page
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>
    </nav>
  );
}