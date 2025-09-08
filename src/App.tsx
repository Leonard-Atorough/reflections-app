import { useEffect, useState } from "react";

import "./App.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Aside } from "./components/layout/Aside";
import { Main } from "./components/layout/Main";

import type { Reflection } from "./types/Reflection";
import { mockReflections } from "./data/mockReflections";

function App() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedReflection =
    reflections.find((r) => r.id === selectedId) || null;

  useEffect(() => {
    setReflections(mockReflections);
  }, []);
  return (
    <>
      <Header />
      <div className="appBody">
        <Aside
          reflections={reflections}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <Main reflection={selectedReflection} setReflections={setReflections} />
      </div>
      <Footer />
    </>
  );
}

export default App;
