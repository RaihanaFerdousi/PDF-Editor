import React, { useState, type JSX } from 'react';
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
  Circle,
  Triangle,
  Star,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

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

const ToolButton: React.FC<ToolButtonProps> = ({ icon: Icon, label, isActive = false, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg transition-all cursor-pointer
      ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
    `}
  >
    <Icon size={20} strokeWidth={2} />
    <span className="text-[11px] font-medium mt-1.5">{label}</span>
  </button>
);

export default function Toolbar(): JSX.Element {
  const [isShapesOpen, setIsShapesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 select-none">
      <div className="flex items-center justify-between px-6 h-20">
        
        <div className="flex items-center">
          <ToolGroup>
            <ToolButton icon={Type} label="Text" />
            <ToolButton icon={Pencil} label="Free Draw" />
            
            <div className="relative">
              <button 
                onClick={() => setIsShapesOpen(!isShapesOpen)}
                className={`
                  flex flex-col items-center justify-center min-w-[72px] h-16 rounded-lg transition-all cursor-pointer
                  ${isShapesOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center gap-0.5">
                  <Shapes size={20} strokeWidth={2} />
                  <ChevronDown size={12} className={`transition-transform ${isShapesOpen ? 'rotate-180' : ''}`} />
                </div>
                <span className="text-[11px] font-medium mt-1.5">Shapes</span>
              </button>

              {isShapesOpen && (
                <div className="absolute top-full mt-2 left-0 w-40 bg-white border border-gray-200 rounded-xl shadow-xl p-2">
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
                    <Square size={16} /> Square
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
                    <Circle size={16} /> Circle
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
                    <Triangle size={16} /> Triangle
                  </button>
                  <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
                    <Star size={16} /> Star
                  </button>
                </div>
              )}
            </div>

            <ToolButton icon={ImagePlus} label="Img upload" />
          </ToolGroup>

          <ToolGroup>
            <ToolButton icon={Palette} label="Color picker" />
            <ToolButton icon={Eraser} label="Eraser" />
          </ToolGroup>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm cursor-pointer"
          >
            <PlusSquare size={18} />
            <span>Add Page</span>
          </button>

          <button 
            type="button"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md cursor-pointer hover:bg-gray-800"
          >
            <Download size={18} />
            <span className="font-semibold text-sm">Export</span>
          </button>
        </div>

      </div>
    </nav>
  );
}