import { ImageResponse } from "next/og";

export const alt = "CodeWithSleek - Websites and systems that turn attention into customers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 84px",
        background: "#f7f8fa",
        color: "#0a0a0a",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 30, fontWeight: 700 }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 18,
            background: "#0a0a0a",
            color: "white",
          }}
        >
          S
        </div>
        CODEwithSleek
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -4,
          lineHeight: 1.02,
        }}
      >
        <span>Websites and systems</span>
        <span style={{ color: "#004fd1" }}>that turn attention into customers.</span>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#555b66" }}>
        Websites · Booking and payments · Automation · Custom software
      </div>
    </div>,
    size,
  );
}
