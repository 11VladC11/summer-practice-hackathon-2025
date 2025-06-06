import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";
import {
  Box,
  Avatar,
  TextField,
  Button,
  Paper,
  useTheme,
  Typography,
  FormHelperText,
} from "@mui/material";

export const Index = () => {
  const { id } = useParams();
  const [text, setText] = useState("");
  const userId = useSelector((state) => state.auth.data?._id);
  const isAuth = Boolean(userId);
  const theme = useTheme();

  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!text.trim()) {
      setError("Comentariul nu poate fi gol");
      return;
    }
    try {
      const fields = { text, postId: id, userId };
      await axios.post("/comment", fields);
      setText("");
      setError("");
    } catch (err) {
      console.warn(err);
      alert("Eroare la trimiterea comentariului");
    }
  };

  if (!isAuth) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        p: 2,
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        background: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      <Avatar
        sx={{
          width: 48,
          height: 48,
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          label="Comment.."
          variant="filled"
          multiline
          maxRows={6}
          fullWidth
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          error={Boolean(error)}
          helperText={
            error ? (
              <FormHelperText
                sx={{ color: theme.palette.error.main, fontWeight: 600 }}
              >
                {error}
              </FormHelperText>
            ) : null
          }
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
            "& .MuiFilledInput-root": {
              background: theme.palette.background.default,
              borderRadius: 1,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.7)",
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.secondary,
            },
            "& .MuiFilledInput-input": {
              color: theme.palette.text.primary,
            },
            "& .MuiFilledInput-root:hover .MuiFilledInput-input": {
              color: theme.palette.primary.light,
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onSubmit}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.paper,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                boxShadow: "0 0 10px rgba(90,141,238,0.8)",
              },
            }}
          >
            Trimite comentariu
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
