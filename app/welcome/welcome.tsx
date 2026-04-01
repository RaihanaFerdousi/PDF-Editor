import { useNavigate } from "react-router";

export function Welcome() {
  const navigate = useNavigate();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    navigate('/editor', { state: { fileUrl: url } });
  };


  return (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-10">
        
        <h1 className="text-5xl tracking-wide text-black font-hand">
          Welcome to PDF Editor
        </h1>

        <div className="flex gap-6">
          
          <label className="font-hand px-8 py-1 border-3 border-black text-black rounded-xl cursor-pointer bg-transparent hover:bg-black hover:text-white transition">
            Import PDF
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleImport}
            />
          </label>

          <button className="font-hand px-8 py-1 border-3 border-black text-black rounded-xl hover:bg-black hover:text-white transition">
            New PDF
          </button>

        </div>

      </div>
    </main>
  );
}