type StatCardProps = {
  label: string;
  value: string | number;
};

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col items-start justify-center border-l-4 border-blue-600 hover:shadow-md transition duration-200">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default StatCard;
