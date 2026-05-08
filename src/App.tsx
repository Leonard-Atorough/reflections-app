import { useEffect, useRef, useState } from "react";

import "./App.css";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Aside } from "./layout/Aside";
import { Main } from "./layout/Main";

import type { Reflection } from "./types/Reflection";
import { mockReflections } from "./data/mockReflections";
import { usePersistReflections } from "./hooks/usePersistedReflections";
import { useSearch } from "./hooks/useSearch";
import { UIContext } from "./contexts/UIContext";
import { ReflectionsContext } from "./contexts";
import { ThemeContext } from "./contexts/ThemeContext";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const lastGoodSave = useRef<Reflection[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const { results: filteredReflections, search } = useSearch(reflections);

  const { status } = usePersistReflections(reflections);

  useEffect(() => {
    if (status === "idle") {
      lastGoodSave.current = reflections;
    } else if (status === "error") {
      setReflections(lastGoodSave.current);
      alert("Unable to save your reflections.");
    }
  }, [status, reflections]);

  useEffect(() => {
    const raw = localStorage.getItem("reflections");
    const saved: Reflection[] = raw ? JSON.parse(raw) : [];
    const data = saved.length > 0 ? saved : mockReflections;
    setReflections(data);
  }, []);

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <UIContext value={{ isEditing, setIsEditing, sidebarVisible, setSidebarVisible }}>
        <ReflectionsContext value={{ reflections, setReflections, selectedId, setSelectedId }}>
          <>
            <Header onSearch={search} />
            <div className="appBody">
              <Aside reflections={filteredReflections} />
              <Main />
            </div>
            <Footer />
          </>
        </ReflectionsContext>
      </UIContext>
    </ThemeContext>
  );
}

export default App;
