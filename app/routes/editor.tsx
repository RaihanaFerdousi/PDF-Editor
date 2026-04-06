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
        #sidebar { display: none !important; width: 0 !important; }
        
        body, html, #page-container { 
          background-color: #121212 !important; 
          background-image: none !important; 
          margin: 0 !important; 
          padding: 0 !important;
          overflow-x: hidden !important;
        }

        #page-container {
          position: static !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          min-width: 100% !important;
          padding: 10px 0 100px 0 !important;
        }

        .pf { 
          background-color: #121212 !important;
          box-shadow: none !important;
          margin-bottom: 8px !important;
          position: relative !important; 
          display: block !important;
        }

        .pc { 
          background-color: white !important; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; 
          outline: none !important;
          margin: 0 auto !important; 
        }

        .t { color: #1a1a1a !important; }
      `;
      frameDoc.head.appendChild(style);

      frameDoc.querySelectorAll('.t').forEach((el) => {
        (el as HTMLElement).contentEditable = "true";
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bgblack overflow-hidden">
      <Toolbar />
      <div className="pt-24 flex-1 flex justify-center p-4 overflow-hidden">

        {htmlUrl ? (
          <iframe
            src={htmlUrl}
            onLoad={makeTextEditable}
            className="w-full bg-black border-none rounded-lg overflow-hidden mb-5 h-[85vh]"
          />
        ) : (
          <div
            className="w-full bg-[#121212] overflow-y-auto overflow-x-hidden rounded-lg flex flex-col h-[85vh] items-center"
          >
            <div
              contentEditable
              className="mx-auto w-[600px] bg-white p-20 min-h-[850px] shadow-2xl mb-5 outline-none text-black"
            >
              <h1 className="text-3xl font-bold mb-4">New PDF</h1>
              <p>Type here...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}