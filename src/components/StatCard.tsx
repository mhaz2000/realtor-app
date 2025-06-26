type StatCardProps = {
  title: string;
  value: number | string;
  color?: 'blue' | 'green' | 'purple';
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  green: 'bg-green-100 text-green-700 border-green-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
};

const StatCard = ({ title, value, color = 'blue' }: StatCardProps) => {
  return (
    <div className={`rounded-xl border p-6 shadow-sm transition hover:shadow-md ${colorMap[color]}`}>
      <h3 className="text-sm font-medium mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
