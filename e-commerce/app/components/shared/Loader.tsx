"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-br from-blue-100 via-purple-100 to-pink-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

        @keyframes dot-blink {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .loader-text {
          font-family: 'DM Mono', monospace;
          font-weight: 500;
          letter-spacing: 0.15em;
          font-size: 36px;
          text-transform: uppercase;
          color: #2d3748;
        }

        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .dot:nth-child(1) { animation: dot-blink 1.2s ease-in-out 0s infinite; }
        .dot:nth-child(2) { animation: dot-blink 1.2s ease-in-out 0.2s infinite; }
        .dot:nth-child(3) { animation: dot-blink 1.2s ease-in-out 0.4s infinite; }

        .loader-card {
          padding: 48px 64px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
      `}</style>

      <div className="loader-card">
        <p className="loader-text">Loading</p>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </div>
    </div>
  );
}