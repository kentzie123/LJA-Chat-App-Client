import { useRef } from "react";
import { useDrag } from "@use-gesture/react";

export default function DraggableVideo({ children }) {
  const ref = useRef(null);

  useDrag(
    ({ offset: [x, y] }) => {
      ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    { target: ref }
  );

  return (
    <div ref={ref} className="absolute top-4 right-4 sm:bottom-4 cursor-move touch-none">
      {children}
    </div>
  );
}
