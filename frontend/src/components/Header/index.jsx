import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
} from "@mui/material";
import { logout, selectIsAuth } from "../../redux/slices/auth";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const theme = useTheme();

  const onClickLogout = () => {
    if (window.confirm("Do you want to log out?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={8}
      sx={{
        background: "linear-gradient(145deg, #161b22, #0d1117)",
        borderBottom: `2px solid ${theme.palette.primary.dark}`,
        top: 0,
        zIndex: theme.zIndex.appBar,
		  borderRadius: "0 ",
      }}
		>
      <Container maxWidth="lg">
		<Toolbar
		disableGutters
		sx={{
				 padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              "&:hover": { opacity: 0.85 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                textShadow: "0 0 6px rgba(90,141,238,0.8)",
              }}
            >
				  GitGud
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {isAuth ? (
              <>
                <Button
                  component={RouterLink}
                  to="/add-post"
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                      boxShadow: "0 0 12px rgba(90,141,238,0.8)",
                    },
                  }}
                >
                  New Project
                </Button>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.error.dark,
                      boxShadow: "0 0 12px rgba(255,23,68,0.8)",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor: theme.palette.text.secondary + "10",
                      borderColor: theme.palette.text.primary,
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                      boxShadow: "0 0 12px rgba(90,141,238,0.8)",
                    },
                  }}
                >
                  Create Account
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
