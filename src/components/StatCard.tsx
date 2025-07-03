import { type ReactNode } from 'react';

export type StatCardProps = {
  title: string;
  value: number | string;
  color?: 'blue' | 'green' | 'purple';
  icon?: ReactNode;
};

const colorMap: Record<string, string> = {
  blue: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900 border-blue-300',
  green: 'bg-gradient-to-br from-green-100 to-green-200 text-green-900 border-green-300',
  purple: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-900 border-purple-300',
};

const StatCard = ({ title, value, color = 'blue', icon }: StatCardProps) => {
  return (
    <div className={`rounded-2xl border p-6 shadow-md hover:shadow-xl transition-all duration-300 ${colorMap[color]}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-full bg-white bg-opacity-30 backdrop-blur-sm shadow-sm">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">{title}</h3>
        </div>
      </div>
      <p className="text-3xl font-extrabold">{value}</p>
    </div>
  );
};

export default StatCard;
