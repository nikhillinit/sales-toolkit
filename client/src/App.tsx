/**
 * App — Unified Signal OS
 * Root component. Wraps app with AppStateProvider and ThemeProvider.
 */
import { AppStateProvider } from '@/contexts/AppState';
import { StoryVaultProvider } from '@/contexts/StoryVaultContext';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { AppDataGate } from './components/AppDataGate';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';

function RedirectTo({ path }: { path: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(path);
  }, [path, setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <RedirectTo path="/os/prepare" />} />
      <Route path="/os" component={() => <RedirectTo path="/os/prepare" />} />
      <Route path="/os/:step" component={Home} />
      <Route path="/manual" component={Home} />
      <Route path="/manual/:pageId" component={Home} />
      <Route path="/scanner" component={Home} />
      <Route path="/lane" component={Home} />
      <Route path="/network" component={Home} />
      <Route path="/roleplay" component={Home} />
      <Route path="/story" component={Home} />
      <Route path="/cadence" component={Home} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppDataGate>
          <AppStateProvider>
            <StoryVaultProvider>
              <Router />
            </StoryVaultProvider>
          </AppStateProvider>
        </AppDataGate>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
