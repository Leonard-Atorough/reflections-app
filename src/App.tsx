import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import "./App.css";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Aside } from "./layout/Aside";
import { Main } from "./layout/Main";
import { ErrorBoundary } from "./components/ErrorBoundary";

import type { Reflection } from "./types/Reflection";
import { mockReflections } from "./data/mockReflections";
import { usePersistReflections } from "./hooks/usePersistedReflections";
import { useSearch } from "./hooks/useSearch";
import { reflectionsReducer } from "./reducers/reflectionsReducer";
import { EditingContext, ReflectionsContext, SidebarContext, ThemeContext } from "./contexts";
function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [reflectionsState, dispatch] = useReducer(reflectionsReducer, {
    reflections: [],
    selectedId: null,
  });

  const lastGoodSave = useRef<Reflection[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { results: filteredReflections, search } = useSearch(reflectionsState.reflections);

  const { status } = usePersistReflections(reflectionsState.reflections);

  useEffect(() => {
    if (status === "idle") {
      lastGoodSave.current = reflectionsState.reflections;
    } else if (status === "error") {
      dispatch({ type: "SET_REFLECTIONS", payload: lastGoodSave.current });
      alert("Unable to save your reflections.");
    }
  }, [status, reflectionsState.reflections]);

  useEffect(() => {
    const raw = localStorage.getItem("reflections");
    const saved: Reflection[] = raw ? JSON.parse(raw) : [];
    const data = saved.length > 0 ? saved : mockReflections;
    dispatch({ type: "SET_REFLECTIONS", payload: data });
  }, []);

  const reflectionsValue = useMemo(
    () => ({
      reflections: reflectionsState.reflections,
      selectedId: reflectionsState.selectedId,
      dispatch,
    }),
    [reflectionsState.reflections, reflectionsState.selectedId],
  );

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
