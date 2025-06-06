// theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#5a8dee" },
    secondary: { main: "#ff4081" },
    success: { main: "#00e676" },
    error: { main: "#ff1744" },
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
    text: {
      primary: "#c9d1d9",
      secondary: "#8b949e",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "0.5px",
    },
  },
  shadows: Array(25).fill("0px 4px 12px rgba(0,0,0,0.5)"),
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          fontWeight: 600,
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 0 10px #5a8dee",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e242c",
          borderRadius: 16,
          boxShadow: "0px 8px 20px rgba(0,0,0,0.6)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#161b22",
          borderRadius: 16,
          boxShadow: "0px 8px 20px rgba(0,0,0,0.6)",
        },
      },
    },
  },
  transitions: {
    duration: {
      standard: 300,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
