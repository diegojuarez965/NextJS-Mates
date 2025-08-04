import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`border border-gray-200 rounded-2xl shadow-md p-5 bg-white
                  hover:shadow-lg transition-shadow ${className ?? ""}`}
    >
      {children}
    </div>
  );
}