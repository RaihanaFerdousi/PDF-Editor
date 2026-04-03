import React, { useState, type JSX } from "react";
import { RiTriangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
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
  type LucideIcon,
} from "lucide-react";

interface ToolbarProps {
  onText: () => void;
  onDraw: () => void;
  onRect: () => void;
  onCircle: () => void;
  onTriangle: () => void;
  onImageUpload: (file: File) => void;
  onErase: () => void;
  onAddPage: () => void | Promise<void>;
  onExport: () => void | Promise<void>;

  selectedText: string | null;
  onTextChange: (text: string) => void;

  // ✅ NEW
  selectedFontSize: number | null;
  onFontSizeChange: (size: number) => void;
}

interface ToolButtonProps {
  icon: LucideIcon | React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ToolGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1 px-4 border-r border-gray-200 last:border-r-0">
    {children}
  </div>
);

const ToolButton: React.FC<ToolButtonProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg transition-all cursor-pointer
      ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }
    `}
  >
    <Icon size={20} strokeWidth={2} />
    <span className="text-[11px] font-medium mt-1.5">{label}</span>
  </button>
);

export default function Toolbar({
  onText,
  onDraw,
  onRect,
  onCircle,
  onTriangle,
  onImageUpload,
  onErase,
  onAddPage,
  onExport,
  selectedText,
  onTextChange,
  selectedFontSize,
  onFontSizeChange,
}: ToolbarProps): JSX.Element {
  const [isShapesOpen, setIsShapesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 select-none">
      <div className="flex items-center justify-between px-6 h-20">
        <div className="flex items-center">
          <ToolGroup>
            <ToolButton icon={Type} label="Text" onClick={onText} />
            <ToolButton icon={Pencil} label="Free Draw" onClick={onDraw} />
            
            <div className="relative">
              <button
                onClick={() => setIsShapesOpen(!isShapesOpen)}
                className={`
                  flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg transition-all cursor-pointer
                  ${
                    isShapesOpen
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                <div className="flex items-center gap-0.5">
                  <Shapes size={20} strokeWidth={2} />
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${
                      isShapesOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <span className="text-[11px] font-medium mt-1.5">
                  Shapes
                </span>
              </button>

              {isShapesOpen && (
                <div className="absolute top-full mt-2 left-0 w-40 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50">
                  <button
                    onClick={() => {
                      onRect();
                      setIsShapesOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <Square size={16} /> Square
                  </button>

                  <button
                    onClick={() => {
                      onCircle();
                      setIsShapesOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <FaRegCircle className="w-4 h-4" /> Circle
                  </button>

                  <button
                    onClick={() => {
                      onTriangle();
                      setIsShapesOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <RiTriangleLine className="w-4 h-4" /> Triangle
                  </button>

                  <button
                    onClick={() => {
                      onRect();
                      setIsShapesOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <Star size={16} /> Star
                  </button>
                </div>
              )}
            </div>

            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                <ImagePlus size={20} />
                <span className="text-[11px] font-medium mt-1.5">
                  Img upload
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onImageUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </ToolGroup>

          <ToolGroup>
            <ToolButton icon={Palette} label="Color" />
            <ToolButton icon={Eraser} label="Eraser" onClick={onErase} />
          </ToolGroup>
        </div>

        {selectedText !== null && (
          <div className="flex items-center gap-3 ml-4">
            <input
              type="text"
              value={selectedText}
              onChange={(e) => onTextChange(e.target.value)}
              className="min-w-[180px] h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              placeholder="Edit text"
            />

            <input
              type="number"
              value={selectedFontSize || 20}
              onChange={(e) => {
                const value = Math.max(5, parseInt(e.target.value) || 10);
                onFontSizeChange(value);
              }}
              className="w-20 h-10 px-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              placeholder="Size"
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onAddPage}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
          >
            <PlusSquare size={18} />
            <span>Add Page</span>
          </button>

          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md hover:bg-gray-800"
          >
            <Download size={18} />
            <span className="font-semibold text-sm">Export</span>
          </button>
        </div>
      </div>
    </nav>
  );
}