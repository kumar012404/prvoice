"use client";

export default function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: "#9CA3AF",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </label>
  );
}
