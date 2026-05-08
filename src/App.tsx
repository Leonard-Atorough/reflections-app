import { useEffect, useMemo, useRef, useState } from "react";

import "./App.css";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Aside } from "./layout/Aside";
import { Main } from "./layout/Main";

import type { Reflection } from "./types/Reflection";
import { mockReflections } from "./data/mockReflections";
import { usePersistReflections } from "./hooks/usePersistedReflections";
import { useSearch } from "./hooks/useSearch";
import { EditingContext, ReflectionsContext, SidebarContext, ThemeContext } from "./contexts";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const lastGoodSave = useRef<Reflection[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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

  const reflectionsValue = useMemo(
    () => ({
      reflections,
      setReflections,
      selectedId,
      setSelectedId,
    }),
    [reflections, selectedId],
  );

  return (
    <ThemeContext value={useMemo(() => ({ theme, setTheme }), [theme])}>
      <EditingContext value={useMemo(() => ({ isEditing, setIsEditing }), [isEditing])}>
        <SidebarContext
          value={useMemo(() => ({ isSidebarOpen, setIsSidebarOpen }), [isSidebarOpen])}
        >
          <ReflectionsContext value={reflectionsValue}>
            <>
              <Header onSearch={search} />
              <div className="appBody">
                <Aside reflections={filteredReflections} />
                <Main />
              </div>
              <Footer />
            </>
          </ReflectionsContext>
        </SidebarContext>
      </EditingContext>
    </ThemeContext>
  );
}

export default App;
