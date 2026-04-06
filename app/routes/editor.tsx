import { useLocation } from "react-router";
import Toolbar from "../Components/Toolbar";

export default function Editor() {
  const location = useLocation();
  const htmlUrl = location.state?.htmlUrl;

  const makeTextEditable = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = e.currentTarget;
    const frameDoc = frame.contentDocument || frame.contentWindow?.document;

    if (frameDoc) {
      const style = frameDoc.createElement('style');
      style.innerHTML = `
      #sidebar, body, html { 
        background-color: #121212 !important; 
        background-image: none !important; 
        border: none !important;
      }

      #page-container {
        background-color: #121212 !important; 
        background-image: none !important;
      }

      .pc { 
        background-color: #1e1e1e !important; 
        border: 1px solid #333 !important;
        box-shadow: 0 4px 15px rgba(43, 29, 29, 0.5) !important;
      }

      .t { 
        color: #1a1a1a !important; 
      }
    `;
      frameDoc.head.appendChild(style);

      const textContainer = frameDoc.getElementById('page-container');
      if (textContainer) {
        textContainer.style.zIndex = "100";
        textContainer.style.position = "relative";
      }

      const backgroundLayers = frameDoc.querySelectorAll('.bi');
      backgroundLayers.forEach(layer => {
        (layer as HTMLElement).style.pointerEvents = "none";
      });

      const textBlocks = frameDoc.querySelectorAll('.t');
      textBlocks.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.contentEditable = "true";
        htmlEl.style.pointerEvents = "auto";
        htmlEl.style.userSelect = "text";
        htmlEl.style.cursor = "text";
      });
    }
  };

  return (
    <div className=" flex flex-col">
      <Toolbar />
      <div className="pt-24 flex-1 flex justify-center p-4">
        {htmlUrl && (
          <iframe
            src={htmlUrl}
            onLoad={makeTextEditable}
            sandbox="allow-same-origin allow-scripts"
            className="w-full max-w-3xl bg-white rounded-lg"
            style={{ height: "85vh", border: "none" }}
          />
        )}
      </div>
    </div>
  );
}


