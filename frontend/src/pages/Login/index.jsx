import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate, Link as RouterLink } from "react-router-dom"; 
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if (!data.payload) return;
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      sx={{
        maxWidth: 360,
        mx: "auto",
        mt: 8,
        p: 4,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 60, height: 60 }}>
          <LockOutlinedIcon />
        </Avatar>
      </Box>
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 4, color: "text.primary" }}
      >
        Log In
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("email", { required: "Enter your email" })}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
          sx={{
            mb: 2,
            backgroundColor: "background.default",
            borderRadius: 1,
            input: { color: "text.primary" },
            label: { color: "text.secondary" },
          }}
        />
        <TextField
          {...register("password", { required: "Enter your password" })}
          label="Password"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          fullWidth
          sx={{
            mb: 3,
            backgroundColor: "background.default",
            borderRadius: 1,
            input: { color: "text.primary" },
            label: { color: "text.secondary" },
          }}
        />
        <Button
          disabled={!isValid}
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: 600,
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
            mb: 2,
          }}
        >
          Submit
        </Button>

        {/* Mini link to Register page */}
        <Typography variant="body2" align="center">
          Don’t have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            color="primary"
            sx={{ fontWeight: 500 }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
