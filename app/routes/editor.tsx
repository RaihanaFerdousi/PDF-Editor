import { useLocation } from "react-router";
import Toolbar from "../Components/Toolbar";

export default function Editor() {
  const location = useLocation();
  const htmlUrl = location.state?.htmlUrl;

  const makeTextEditable = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = e.currentTarget;
    const frameDoc = frame.contentDocument || frame.contentWindow?.document;

    if (frameDoc) {
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toolbar />
      <div className="pt-24 flex-1 flex justify-center p-4">
        {htmlUrl && (
          <iframe
            src={htmlUrl}
            onLoad={makeTextEditable}
            sandbox="allow-same-origin allow-scripts"
            className="w-full max-w-5xl bg-white shadow-2xl rounded-lg"
            style={{ height: "85vh", border: "none" }}
          />
        )}
      </div>
    </div>
  );
}


