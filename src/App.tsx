import { useEffect, useState } from "react";

import "./App.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Aside } from "./components/layout/Aside";
import { Main } from "./components/layout/Main";

import type { Reflection } from "./types/Reflection";
import { mockReflections } from "./data/mockReflections";
import { usePersistReflections } from "./hooks/usePersistedReflections";
import { UIContext } from "./contexts/UIContext";
import { ReflectionsContext } from "./contexts";

function App() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [lastGoodSave, setLastGoodSave] = useState<Reflection[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const { status } = usePersistReflections(reflections);

  useEffect(() => {
    if (status === "idle") {
      setLastGoodSave(reflections);
    } else if (status === "error") {
      setReflections(lastGoodSave);
      alert("Unable to save your reflections.");
    }
  }, [status, reflections, lastGoodSave]);

  useEffect(() => {
    const raw = localStorage.getItem("reflections");
    const saved: Reflection[] = raw ? JSON.parse(raw) : [];
    const data = saved.length > 0 ? saved : mockReflections;
    setReflections(data);
  }, []);

  return (
    <UIContext value={{ isEditing, setIsEditing, sidebarVisible, setSidebarVisible }}>
      <ReflectionsContext value={{ reflections, setReflections, selectedId, setSelectedId }}>
        <>
          <Header setSelectedId={setSelectedId} />
          <div className="appBody">
            <Aside />
            <Main />
          </div>
          <Footer />
        </>
      </ReflectionsContext>
    </UIContext>
  );
}

export default App;
