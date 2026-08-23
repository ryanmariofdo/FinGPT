import Svg, { Circle } from "react-native-svg";

type Slice = { value: number; color: string };

type Props = {
  data: Slice[];
  size?: number;
  strokeWidth?: number;
};

export function DonutChart({ data, size = 180, strokeWidth = 24 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  let offset = 0;
  const arcs = data.map((slice) => {
    const fraction = total > 0 ? slice.value / total : 0;
    const dash = fraction * circumference;
    const arc = {
      color: slice.color,
      dashArray: `${dash} ${circumference - dash}`,
      dashOffset: -offset,
    };
    offset += dash;
    return arc;
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, index) => (
        <Circle
          key={index}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeDasharray={arc.dashArray}
          strokeDashoffset={arc.dashOffset}
          fill="none"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      ))}
    </Svg>
  );
}
