export const MUSIC_GRADIENT_BACKGROUND =
  "var(--wave-page-bg)";

export const pageShellSx = {
  minHeight: "100vh",
  background: MUSIC_GRADIENT_BACKGROUND,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 2,
};

export const orbOneSx = {
  position: "absolute",
  width: 360,
  height: 360,
  borderRadius: "50%",
  background: "var(--wave-orb-1)",
  filter: "blur(110px)",
  top: "-10%",
  left: "-4%",
  zIndex: 0,
};

export const orbTwoSx = {
  position: "absolute",
  width: 420,
  height: 420,
  borderRadius: "50%",
  background: "var(--wave-orb-2)",
  filter: "blur(130px)",
  bottom: "-14%",
  right: "-8%",
  zIndex: 0,
};

export const glassCardSx = {
  p: 4,
  borderRadius: 5,
  maxWidth: 620,
  width: "100%",
  zIndex: 1,
  backdropFilter: "blur(16px)",
  background: "var(--wave-card-bg)",
  border: "1px solid var(--wave-card-border)",
  boxShadow: "var(--wave-card-shadow)",
  color: "var(--wave-text-primary)",
};

export const titleSx = {
  fontWeight: 800,
  letterSpacing: "0.02em",
  color: "var(--wave-text-primary)",
};

export const subtitleSx = {
  color: "var(--wave-text-secondary)",
};

export const primaryButtonSx = {
  py: 1.3,
  borderRadius: "12px",
  background: "var(--wave-accent-gradient)",
  color: "#fff",
  boxShadow: "var(--wave-accent-shadow)",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "var(--wave-accent-shadow-hover)",
    background: "var(--wave-accent-gradient-hover)",
  },
};

export const outlineButtonSx = {
  py: 1.3,
  borderRadius: "12px",
  color: "var(--wave-outline-text)",
  borderColor: "var(--wave-outline-border)",
  backgroundColor: "var(--wave-outline-bg)",
  "&:hover": {
    borderColor: "var(--wave-outline-border-hover)",
    backgroundColor: "var(--wave-outline-bg-hover)",
  },
};

export const subtleTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "var(--wave-input-text)",
    borderRadius: "12px",
    backgroundColor: "var(--wave-input-bg)",
    "& fieldset": {
      borderColor: "var(--wave-input-border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--wave-input-border-hover)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7c4dff",
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--wave-input-label)",
  },
  "& .MuiFormHelperText-root": {
    color: "var(--wave-input-helper)",
  },
};
