import { ImageResponse } from "next/og";

export const alt = "BreakMyBot";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          background: "rgb(11, 13, 18)",
          color: "rgb(244, 247, 251)",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "68px 72px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.58,
            }}
          >
            BreakMyBot
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 860,
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 86,
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
                fontWeight: 700,
              }}
            >
              Stress test your AI API before production
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                fontSize: 30,
                lineHeight: 1.45,
                opacity: 0.72,
              }}
            >
              Open-source CLI for finding instability, schema failures, and
              edge-case breakdowns in single-call AI endpoints.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.5,
            }}
          >
            <div
              style={{
                height: 12,
                width: 12,
                borderRadius: 9999,
                background: "rgb(124, 145, 255)",
              }}
            />
            <div>Open-source CLI</div>
            <div
              style={{
                height: 12,
                width: 12,
                borderRadius: 9999,
                background: "rgb(255, 255, 255)",
              }}
            />
            <div>Single-call AI APIs</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
