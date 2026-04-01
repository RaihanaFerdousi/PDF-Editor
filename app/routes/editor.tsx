import { Viewer, Worker } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { useLocation } from "react-router";
import Canvas from "~/Components/canvas";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";

export default function Editor() {
  const location = useLocation();
  const fileUrl = location.state?.fileUrl;

  const plugin = thumbnailPlugin();
  const { Thumbnails } = plugin;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {fileUrl && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div className="flex overflow-hidden">
                <div className="w-48 bg-white rounded-l-md border-l-2 flex-shrink-0 h-[750px] border-gray-300 overflow-y-auto p-2">
                  <Thumbnails />
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <Viewer
                    fileUrl={fileUrl}
                    plugins={[plugin]}
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