import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

export const defaultTheme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: 12,
          borderColor: grey[100],
          borderStyle: "solid",
          borderWidth: 1,
          "&:hover":{
            borderColor: 'blue'
          }
        },
      },
      defaultProps: {
        elevation: 0,
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
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
      defaultProps: {
        elevation: 1,
      },
    },
  },
  palette: {
    // primary: pink
  },
});
