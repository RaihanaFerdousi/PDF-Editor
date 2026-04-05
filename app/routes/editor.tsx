import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Toolbar from "../Components/Toolbar";

export default function Editor() {
  const location = useLocation();
  const [pdfHtml, setPdfHtml] = useState<string>("");

  useEffect(() => {
    const fetchHtml = async () => {
      const fileUrl = location.state?.fileUrl;
      if (!fileUrl) return;

      const formData = new FormData();
      const blob = await fetch(fileUrl).then(res => res.blob());
      formData.append("file", blob);

      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const html = await res.text();
      setPdfHtml(html);
    };

    fetchHtml();
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toolbar />

      <div className="pt-24 flex justify-center">
        <div className="relative bg-white shadow-lg">
          <div
            className="pdf-html"
            dangerouslySetInnerHTML={{ __html: pdfHtml }}
          />

          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            id="draw-layer"
          />

        </div>
      </div>
    </div>
  );
}