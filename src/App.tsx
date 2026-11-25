/**
 * App root wiring:
 * - Redux Provider  → global search history + favourites state
 * - MUI Theme       → shared look & feel
 * - PlacesPage      → main (and only) screen for this assessment
 */
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { store } from './app/store';
import { appTheme } from './theme/theme';
import { AppLayout } from './components/layout/AppLayout';
import { PlacesPage } from './pages/PlacesPage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <AppLayout>
          <PlacesPage />
        </AppLayout>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
