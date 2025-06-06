import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { Image, Title, FolderZipOutlined } from "@mui/icons-material";

export const AddPost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const theme = useTheme();
  const isAuth = useSelector(selectIsAuth);

  const [isLoading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [zipUrl, setZipUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [description, setDescription] = React.useState("");
  const inputFileRef = React.useRef(null);
  const zipFileRef = React.useRef(null);

  const [errors, setErrors] = React.useState({ title: "", description: "" });
  const isEditing = Boolean(id);

  //
  // ─── IMAGE UPLOAD HANDLERS ────────────────────────────────────────────────
  //
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image");
    }
  };

  const handleChangeImage = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };
  const handleDropImage = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  };
  const handleDragOverImage = (e) => e.preventDefault();
  const onClickRemoveImage = () => setImageUrl("");

  //
  // ─── ZIP UPLOAD HANDLERS ──────────────────────────────────────────────────
  //
  const uploadZip = async (file) => {
    try {
      const formData = new FormData();
      formData.append("zip", file);
      const { data } = await axios.post("/uploadZip", formData);
      setZipUrl(data.url);
    } catch (err) {
      console.error("Error uploading ZIP:", err);
      alert("Error uploading ZIP file");
    }
  };

  const handleChangeZip = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadZip(file);
  };
  const handleDropZip = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadZip(file);
  };
  const handleDragOverZip = (e) => e.preventDefault();
  const onClickRemoveZip = () => setZipUrl("");

  //
  // ─── VALIDATION ───────────────────────────────────────────────────────────
  //
  const validateFields = () => {
    const newErrors = { title: "", description: "" };
    let valid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  //
  // ─── SUBMIT (CREATE vs EDIT) ───────────────────────────────────────────────
  //
  const onSubmit = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      // Build exactly the same “fields” payload for both create and edit:
      const fields = {
        title,
        text: description,
        tagsTheme: tags,
        imageUrl,
        zipUrl,
      };

      if (isEditing) {
        // EDIT: patch existing
        await axios.patch(`/posts/${id}`, fields);
        navigate(`/posts/${id}`);
      } else {
        // CREATE: post new
        const { data } = await axios.post("/posts", fields);
        navigate(`/posts/${data._id}`);
      }
    } catch (error) {
      console.error("Error submitting the post:", error);
      alert("Error submitting the post");
    } finally {
      setLoading(false);
    }
  };

  //
  // ─── LOAD EXISTING POST IF “EDIT” ─────────────────────────────────────────
  //
  React.useEffect(() => {
    if (!id) return;

    // Fetch existing post data and hydrate ALL the fields
    axios
      .get(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title || "");
        setDescription(data.text || "");
        setImageUrl(data.imageUrl || "");
        setZipUrl(data.zipUrl || "");
        setTags((data.tagsTheme || []).join(","));
      })
      .catch((err) => {
        console.error("Error fetching post for edit:", err);
      });
  }, [id]);

  //
  // ─── PROTECT ROUTE IF NOT AUTHENTICATED ───────────────────────────────────
  //
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  //
  // ─── RENDER FORM ───────────────────────────────────────────────────────────
  //
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: 5,
          background: "linear-gradient(145deg, #161b22, #0d1117)",
          borderRadius: 3,
          boxShadow: "0px 8px 30px rgba(0,0,0,0.7)",
          border: `1px solid ${theme.palette.primary.dark}`,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            color: theme.palette.primary.main,
            textShadow: "0 0 8px rgba(90,141,238,0.8)",
            fontWeight: 700,
          }}
        >
          {isEditing ? "Edit Project" : "Submit Project"}
        </Typography>

        {/** ─── IMAGE UPLOAD AREA ───────────────────────────────────────── **/}
        <Box mb={4}>
          <Box
            onDrop={handleDropImage}
            onDragOver={handleDragOverImage}
            onClick={() => inputFileRef.current.click()}
            sx={{
              width: "100%",
              p: 3,
              textAlign: "center",
              border: `2px dashed ${theme.palette.primary.main}`,
              borderRadius: 2,
              cursor: "pointer",
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "10",
              },
            }}
          >
            <Image
              sx={{ fontSize: 48, mb: 1, color: theme.palette.primary.main }}
            />
            <Typography>
              {imageUrl ? "Change Image" : "Drag & Drop an image here"}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              or click to select
            </Typography>
            <input
              ref={inputFileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleChangeImage}
            />
          </Box>

          {imageUrl && (
            <Box mb={3} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="error"
                onClick={onClickRemoveImage}
                sx={{
                  mt: 2,
                  width: "100%",
                  borderRadius: 2,
                  fontWeight: 600,
                  background: theme.palette.error.main,
                  boxShadow: "0 0 10px rgba(255,23,68,0.7)",
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                Remove Image
              </Button>
              <Box
                component="img"
                src={`http://localhost:4444${imageUrl}`}
                alt="Uploaded"
                sx={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
                  mt: 2,
                }}
              />
            </Box>
          )}
        </Box>

        {/** ─── ZIP UPLOAD AREA ─────────────────────────────────────────────── **/}
        <Box mb={4}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              color: theme.palette.primary.light,
              fontWeight: 600,
            }}
          >
            Upload a ZIP
          </Typography>

          <Box
            onDrop={handleDropZip}
            onDragOver={handleDragOverZip}
            onClick={() => zipFileRef.current.click()}
            sx={{
              width: "100%",
              p: 3,
              textAlign: "center",
              border: `2px dashed ${theme.palette.primary.main}`,
              borderRadius: 2,
              cursor: "pointer",
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "10",
              },
            }}
          >
            <FolderZipOutlined
              sx={{ fontSize: 48, mb: 1, color: theme.palette.primary.main }}
            />
            <Typography>
              {zipUrl ? "Change ZIP File" : "Drag & Drop a .zip here"}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              or click to select (only .zip)
            </Typography>
            <input
              ref={zipFileRef}
              type="file"
              hidden
              accept=".zip"
              onChange={handleChangeZip}
            />
          </Box>

          {zipUrl && (
            <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={onClickRemoveZip}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  background: theme.palette.error.main,
                  boxShadow: "0 0 10px rgba(255,23,68,0.7)",
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                Remove ZIP
              </Button>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.primary.light, fontStyle: "italic" }}
              >
                <a
                  href={`http://localhost:4444${zipUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.palette.primary.light,
                    textDecoration: "underline",
                  }}
                >
                  View: {zipUrl.split("/").pop()}
                </a>
              </Typography>
            </Box>
          )}
        </Box>

        {/** ─── TEXT FIELDS (Title, Tags, Description) ─────────────────────── **/}
        <Box sx={{ display: "grid", gap: 3 }}>
          <TextField
            label="Title"
            placeholder="Project Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            fullWidth
            variant="filled"
            margin="dense"
            error={Boolean(errors.title)}
            helperText={
              errors.title && (
                <FormHelperText
                  sx={{ color: theme.palette.error.main, fontWeight: 600 }}
                >
                  {errors.title}
                </FormHelperText>
              )
            }
            sx={{
              backgroundColor: "#1e242c",
              borderRadius: 1,
              "& .MuiFilledInput-root": {
                background: "#1e242c",
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Title sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Technology Tags"
            placeholder="Technology Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            variant="filled"
            margin="dense"
            sx={{
              backgroundColor: "#1e242c",
              borderRadius: 1,
              "& .MuiFilledInput-root": {
                background: "#1e242c",
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

          <TextField
            label="Description"
            placeholder="Enter project description..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: "" }));
              }
            }}
            fullWidth
            variant="filled"
            margin="dense"
            multiline
            rows={6}
            error={Boolean(errors.description)}
            helperText={
              errors.description && (
                <FormHelperText
                  sx={{ color: theme.palette.error.main, fontWeight: 600 }}
                >
                  {errors.description}
                </FormHelperText>
              )
            }
            sx={{
              backgroundColor: "#1e242c",
              borderRadius: 1,
              "& .MuiFilledInput-root": {
                background: "#1e242c",
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
        </Box>

        {/** ─── SUBMIT + CANCEL BUTTONS ─────────────────────────────────────── **/}
        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            onClick={onSubmit}
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: "0 0 12px rgba(90,141,238,0.8)",
              "&:hover": {
                boxShadow: "0 0 20px rgba(90,141,238,1)",
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {isEditing ? "Save" : "Post"}
          </Button>
          <Button
            onClick={() => navigate("/")}
            fullWidth
            size="large"
            variant="outlined"
            color="secondary"
            sx={{
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              "&:hover": {
                backgroundColor: theme.palette.secondary.main + "10",
                borderColor: theme.palette.secondary.dark,
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
