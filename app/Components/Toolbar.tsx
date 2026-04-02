import React, { useState, type JSX } from 'react';
import { Circle as FabricCircle, IText, PencilBrush, Polygon, Rect, Triangle as FabricTriangle, type Canvas as FabricCanvas } from 'fabric';
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
} from 'lucide-react';

interface ToolbarProps {
    canvas?: FabricCanvas | null;
    onAddPage?: () => void | Promise<void>;
    onExport?: () => void | Promise<void>;
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

export default function Toolbar({ canvas, onAddPage, onExport }: ToolbarProps): JSX.Element {
    const [isShapesOpen, setIsShapesOpen] = useState(false);

    const disableDrawing = () => {
        if (canvas) {
            canvas.isDrawingMode = false;
        }
    };

    const addCircle = () => {
        if (!canvas) return;
        disableDrawing();

        const circle = new FabricCircle({
            left: 200,
            top: 150,
            radius: 50,
            fill: 'purple',
        });

        canvas.add(circle);
        canvas.renderAll();
    }

    const addSquare = () => {
        if (!canvas) return;
        disableDrawing();
        const square = new Rect({
            left: 300,
            top: 150,
            fill: 'blue',
            width: 100,
            height: 100
        });
        canvas.add(square);
        canvas.renderAll();
    }

    const addStar = () => {
        if (!canvas) return;
        disableDrawing();

        const points = [];
        const numPoints = 5;
        const outerRadius = 50;
        const innerRadius = 25;
        const centerX = 0;
        const centerY = 0;

        for (let i = 0; i < numPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / numPoints;
            points.push({
                x: centerX + radius * Math.sin(angle),
                y: centerY - radius * Math.cos(angle),
            });
        }

        const star = new Polygon(points, {
            left: 450,
            top: 150,
            fill: 'gold',
            strokeWidth: 2,
        });

        canvas.add(star);
        canvas.renderAll();
    };

    const addTriangle = () => {
        if (!canvas) return;
        disableDrawing();

        const triangle = new FabricTriangle({
            height: 100
        });

        canvas.add(triangle);
        canvas.renderAll();
    }

    const addText = () => {
        if (!canvas) return;
        disableDrawing();

        const text = new IText('text', {
            left: 900,
            top: 150,
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 'black',
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const freeHandDrawing = () => {
        if (!canvas) return;

        canvas.isDrawingMode = !canvas.isDrawingMode;

        if (canvas.isDrawingMode) {
            canvas.freeDrawingBrush = new PencilBrush(canvas);
            canvas.freeDrawingBrush.color = 'black';
            canvas.freeDrawingBrush.width = 5;
        };

        canvas.renderAll();
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 select-none">
            <div className="flex items-center justify-between px-6 h-20">

                <div className="flex items-center">
                    <ToolGroup>
                        <ToolButton icon={Type} label="Text" onClick={addText} />
                        <ToolButton icon={Pencil} label="Free Draw" onClick={freeHandDrawing} />

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
                                    <button onClick={addSquare} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
                                        <Square size={16} /> Square
                                    </button>
                                    <button onClick={addCircle} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
                                        <FaRegCircle className="w-4 h-4" /> Circle
                                    </button>
                                    <button onClick={addTriangle} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
                                        <RiTriangleLine className="w-4 h-4" /> Triangle
                                    </button>
                                    <button onClick={addStar} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer">
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
                        onClick={onAddPage}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm cursor-pointer"
                    >
                        <PlusSquare size={18} />
                        <span>Add Page</span>
                    </button>

                    <button
                        type="button"
                        onClick={onExport}
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