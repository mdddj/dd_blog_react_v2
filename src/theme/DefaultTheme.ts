import { createTheme } from "@mui/material";
import { pink } from "@mui/material/colors";

export const defaultTheme = createTheme({
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: 12,
                    cursor: "pointer"
                }
            }
        },
        MuiTypography: {
            variants: [
                {
                    props: { variant: "h5", color: "secondary" },
                    style: {
                        fontWeight: "bold"
                    }
                }
            ]
        }
    },
    palette: {
        primary: pink
    }
});