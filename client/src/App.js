import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Navbar from './static/components/Navbar';

import '@fontsource/inter';

import {
  ConfigProvider as AntdConfigProvider,
  theme as antdTheme
} from 'antd';


import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';

import MainRouter from "./MainRouter";

import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';

function App() {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const materialTheme = materialExtendTheme(
    createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
      },
    })
  );


  return (
    <div className="App">



      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>

          <AntdConfigProvider
            theme={{
              // 1. Use dark algorithm
              algorithm: prefersDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,

            }}
          >
            <CssBaseline enableColorScheme />
            <Navbar />
            <MainRouter />

          </AntdConfigProvider>

        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>

      {/* <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <MainRouter />
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider> */}



    </div>
  );
}

export default App;
