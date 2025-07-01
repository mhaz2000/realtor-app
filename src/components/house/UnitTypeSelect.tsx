import { Home } from 'lucide-react';

type Props = {
  unitTypes: string[];
  selectedUnitType: string | null | undefined;
  onChange: (val: string | null) => void;
  allLabel: string;
};

const UnitTypeSelect = ({ unitTypes, selectedUnitType, onChange, allLabel }: Props) => (
  <div className="flex items-center space-x-3">
    <Home className="text-blue-600 w-5 h-5" />
    <select
      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selectedUnitType ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">{allLabel}</option>
      {unitTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>
);

export default UnitTypeSelect;
