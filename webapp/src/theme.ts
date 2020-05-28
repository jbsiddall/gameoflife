import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { green, orange, blue, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[800],
    },
    secondary: {
      main: '#FF1D89',
    }
  },
});

export default theme;
