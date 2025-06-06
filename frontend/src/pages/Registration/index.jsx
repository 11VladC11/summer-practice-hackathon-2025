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
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
      city: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const payload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      bio: values.bio,
      location: { city: values.city },
    };
    const data = await dispatch(fetchRegister(payload));
    if (!data.payload) return;
    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) return <Navigate to="/" />;

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        color: "text.primary",
      }}
    >
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        Create Account
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }} />
      </Box>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Enter your full name" })}
          label="Full Name"
          fullWidth
          sx={{ mb: 2, bgcolor: "background.default", borderRadius: 1 }}
        />
        <TextField
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email", { required: "Enter your email" })}
          label="E-Mail"
          type="email"
          fullWidth
          sx={{ mb: 2, bgcolor: "background.default", borderRadius: 1 }}
        />
        <TextField
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password", { required: "Enter your password" })}
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2, bgcolor: "background.default", borderRadius: 1 }}
        />
        <TextField
          {...register("bio")}
          label="Bio (optional)"
          multiline
          rows={3}
          fullWidth
          inputProps={{ maxLength: 280 }}
          sx={{ mb: 2, bgcolor: "background.default", borderRadius: 1 }}
        />
        <TextField
          {...register("city")}
          label="City (optional)"
          fullWidth
          sx={{ mb: 3, bgcolor: "background.default", borderRadius: 1 }}
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
          Register
        </Button>

        {/* 👇 Mini link to login */}
        <Typography variant="body2" align="center">
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            color="primary"
            sx={{ fontWeight: 500 }}
          >
            Log in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
