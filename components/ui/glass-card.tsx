import { ReactNode } from "react";

export const GlassCard = ({ children, className = "", hoverEffect = false, status = 'active' }: { children: ReactNode, className?: string, hoverEffect?: boolean, status?: 'active' | 'inactive' }) => (
  <div className={`
    relative bg-white backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6
    ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-yellow-400/30' : ''}
    ${className}
    ${status === 'inactive' ? 'grayscale-100' : ''}
  `}>
    {children}
  </div>
);