import { style } from "@vanilla-extract/css";

export const bg = style({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: 70,
  width: 400,
});

export const text = style({
  position: "absolute",
  zIndex: 1,
  top: 10,
  left: 10,
});
