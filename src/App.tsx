import { useEffect, useMemo, useReducer, useState } from "react";

import "./App.css";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Aside } from "./layout/Aside";
import { Main } from "./layout/Main";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { mockReflections } from "./data/mockReflections";
import { reflectionsReducer } from "./reducers/reflectionsReducer";
import { EditingContext, ReflectionsContext, SidebarContext, ThemeContext } from "./contexts";
import { usePersistentReflections, useSearch } from "./hooks";
function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [reflectionsState, dispatch] = useReducer(reflectionsReducer, {
    reflections: [],
    selectedId: null,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { results: filteredReflections, search } = useSearch(reflectionsState.reflections);

  const { loadReflections } = usePersistentReflections(reflectionsState.reflections);

  useEffect(() => {
    const data = loadReflections();
    dispatch({
      type: "SET_REFLECTIONS",
      payload: data.length > 0 ? data : mockReflections,
    });
  }, [loadReflections]);

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
