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
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const selectedReflection =
    reflections.find((r) => r.id === selectedId) || null;

  const handleDelete = () => {
    if (!selectedId) return;

    if(!window.confirm("Delete this reflection? This action cannot be undone!")) {
      return;
    }

    setReflections(prev => {
      const filtered = prev.filter(r => r.id !== selectedId);

      const previousReflection = filtered.at(-1) ?? null;
      setSelectedId(previousReflection ? previousReflection.id : null);
      return filtered;
    })
  };

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
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setSelectedId={setSelectedId}
        />
        <Main
          reflection={selectedReflection}
          setReflections={setReflections}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleDelete={handleDelete}
        />
      </div>
      <Footer />
    </>
  );
}

export default App;
