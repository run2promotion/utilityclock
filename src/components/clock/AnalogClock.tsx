"use client";

type AnalogClockProps = {
  date: Date;
  size?: number;
  showSeconds?: boolean;
};

export function AnalogClock({
  date,
  size = 280,
  showSeconds = true,
}: AnalogClockProps) {
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
  const minutes = date.getMinutes() + seconds / 60;
  const hours = (date.getHours() % 12) + minutes / 60;

  const secondsAngle = seconds * 6; // 360 / 60
  const minutesAngle = minutes * 6; // 360 / 60
  const hoursAngle = hours * 30; // 360 / 12

  const center = size / 2;
  const radius = center - 14;

  // 12 hour tick marks
  const hourTicks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = center + Math.sin(angle) * (radius - 12);
    const y1 = center - Math.cos(angle) * (radius - 12);
    const x2 = center + Math.sin(angle) * radius;
    const y2 = center - Math.cos(angle) * radius;
    return { i, x1, y1, x2, y2 };
  });

  // 60 minute tick marks (smaller)
  const minuteTicks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const angle = (i * 6 * Math.PI) / 180;
    const x1 = center + Math.sin(angle) * (radius - 6);
    const y1 = center - Math.cos(angle) * (radius - 6);
    const x2 = center + Math.sin(angle) * radius;
    const y2 = center - Math.cos(angle) * radius;
    return { i, x1, y1, x2, y2 };
  }).filter(Boolean);

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* Outer bezel */}
        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          className="fill-zinc-100/90 stroke-zinc-300/80 dark:fill-zinc-900/90 dark:stroke-zinc-800"
          strokeWidth="3"
        />

        {/* Inner face */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="fill-white/60 dark:fill-zinc-950/80"
        />

        {/* Minute ticks */}
        {minuteTicks.map((t) => t && (
          <line
            key={t.i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            className="stroke-zinc-400 dark:stroke-zinc-700"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Hour ticks */}
        {hourTicks.map((t) => (
          <line
            key={t.i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            className="stroke-zinc-700 dark:stroke-zinc-300"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}

        {/* Hour numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const numRadius = radius - 24;
          const x = center + Math.sin(angle) * numRadius;
          const y = center - Math.cos(angle) * numRadius + 4;
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-zinc-600 font-semibold text-xs dark:fill-zinc-400 select-none"
            >
              {num}
            </text>
          );
        })}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center + 10}
          x2={center + Math.sin((hoursAngle * Math.PI) / 180) * (radius * 0.52)}
          y2={center - Math.cos((hoursAngle * Math.PI) / 180) * (radius * 0.52)}
          className="stroke-zinc-800 dark:stroke-zinc-100"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center + 14}
          x2={center + Math.sin((minutesAngle * Math.PI) / 180) * (radius * 0.74)}
          y2={center - Math.cos((minutesAngle * Math.PI) / 180) * (radius * 0.74)}
          className="stroke-zinc-700 dark:stroke-zinc-200"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Second hand */}
        {showSeconds && (
          <g>
            <line
              x1={center - Math.sin((secondsAngle * Math.PI) / 180) * 18}
              y1={center + Math.cos((secondsAngle * Math.PI) / 180) * 18}
              x2={center + Math.sin((secondsAngle * Math.PI) / 180) * (radius * 0.84)}
              y2={center - Math.cos((secondsAngle * Math.PI) / 180) * (radius * 0.84)}
              style={{ stroke: "var(--primary-clock-color)" }}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx={center}
              cy={center}
              r="3.5"
              style={{ fill: "var(--primary-clock-color)" }}
            />
          </g>
        )}

        {/* Center cap */}
        <circle
          cx={center}
          cy={center}
          r="4.5"
          className="fill-zinc-900 dark:fill-zinc-100"
        />
      </svg>
    </div>
  );
}
