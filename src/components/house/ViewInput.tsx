import { Binoculars } from 'lucide-react';

type Props = {
  value: string | null;
  onChange: (val: string) => void;
  placeholder: string;
};

const ViewInput = ({ value, onChange, placeholder }: Props) => (
  <div className="flex items-center space-x-3">
    <Binoculars className="text-blue-600 w-5 h-5" />
    <input
      type="text"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default ViewInput;
