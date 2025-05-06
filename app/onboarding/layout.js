import "../globals.css";

export default function OnboardingLayout({ children }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "white",
      color: "black",
      fontFamily: "'Manrope', sans-serif",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center",
        gap: "24px",
      }}>
        {children}
      </div>
    </div>
  );
}