import { Viewer, Worker } from "@react-pdf-viewer/core";
import { useLocation } from "react-router";
import Canvas from "~/Components/canvas";

export default function Editor() {
  const location = useLocation();
  const fileUrl = location.state?.fileUrl;

  return (
    <div className="bg-gray-50">
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {fileUrl && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div>
                <div>a
                  <Viewer 
                    fileUrl={fileUrl} 
                  />
                </div>
              </div>
            </Worker>
          )}
        </div>
      </div>

      <Canvas />
    </div>
  );
}