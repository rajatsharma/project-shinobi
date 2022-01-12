import { globalStyle } from "@vanilla-extract/css";

globalStyle("body", {
  display: "flex",
  margin: 0,
  overflowX: "hidden",
  overflowY: "hidden",
  background: "#ececec",
  color: "#151515",
  border: "solid 9px #4ee58b",
  minHeight: "98vh",
});

globalStyle("#root", {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

globalStyle("input", {
  border: "none",
  fontSize: 24,
});

globalStyle("input:focus-visible", {
  outline: "none",
});
