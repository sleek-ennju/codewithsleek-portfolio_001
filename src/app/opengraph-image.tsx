import { ImageResponse } from "next/og";

export const alt = "Code with Sleek - Crafting logic, the sleek way";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 84px", background: "#f7f8fa", color: "#0a0a0a" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 30, fontWeight: 700 }}>
        <div style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 18, background: "#0a0a0a", color: "white" }}>S</div>
        CODEwithSleek
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02 }}>
        <span>Crafting logic,</span>
        <span style={{ color: "#2361d1" }}>the sleek way.</span>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#555b66" }}>Frontend engineering · React · Tailwind CSS · TypeScript · MERN Stack · Figma</div>
    </div>,
    size,
  );
}
