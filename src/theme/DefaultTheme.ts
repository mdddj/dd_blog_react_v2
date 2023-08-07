import { createTheme } from "@mui/material";

export const defaultTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: 12,
          cursor: "pointer",
        },
      },
      defaultProps: {
        elevation: 1,
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "h5", color: "secondary" },
          style: {
            fontWeight: "bold",
          },
        },
      ],
    },
  },
  palette: {
    // primary: pink
  },
});
