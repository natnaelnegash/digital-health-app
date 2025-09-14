// components/shared/Loader.tsx

import { RefreshCcw } from "lucide-react";

interface LoaderProps {
  style?: React.CSSProperties; // optional inline style
}

export const Loader = ({ style }: LoaderProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // padding: "1rem 0",
        ...style
      }}
    >
      <RefreshCcw
        style={{
          width: "16px",
          height: "16px",
          color: "white",
          animation: "spin 1s linear infinite",
        }}
      />
      {/* Add keyframes globally if not already present */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
