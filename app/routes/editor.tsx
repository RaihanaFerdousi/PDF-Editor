  import { Viewer, Worker } from "@react-pdf-viewer/core";
  import { useLocation } from "react-router";
  import Canvas from "~/Components/canvas";

  export default function Editor() {
      const location = useLocation();
      const fileUrl = location.state?.fileUrl;

      return (
      <div style={{ position: 'relative' }}>
        {fileUrl && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} />
          </Worker>
        )}
        
        <Canvas/>
      </div>
    );
  }