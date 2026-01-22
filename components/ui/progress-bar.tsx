export const ProgressBar = ({ value, color = "bg-neutral-900" }: { value: number, color?: string }) => (
  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden mt-3">
    <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
  </div>
);