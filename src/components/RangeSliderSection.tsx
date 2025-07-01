import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export type Range = { min: number; max: number };

type Props = {
  range: Range;
  tempVals: [string, string];
  setTempVals: (vals: [string, string]) => void;
  onBlur: () => void;
  icon?: React.ReactNode;
};

const RangeSliderSection: React.FC<Props> = ({
  range,
  tempVals,
  setTempVals,
  onBlur,
  icon,
}) => {
  const [committedVals, setCommittedVals] = useState<[string, string]>(tempVals);

  const handleBlur = () => {
    let min = parseFloat(tempVals[0]);
    let max = parseFloat(tempVals[1]);

    if (isNaN(min)) min = range.min;
    if (isNaN(max)) max = range.max;

    if (min < range.min) min = range.min;
    if (max > range.max) max = range.max;
    if (min > max) min = max;

    const newMinStr = min.toString();
    const newMaxStr = max.toString();

    if (newMinStr !== tempVals[0] || newMaxStr !== tempVals[1]) {
      setTempVals([newMinStr, newMaxStr]);
    }

    if (committedVals[0] !== newMinStr || committedVals[1] !== newMaxStr) {
      setCommittedVals([newMinStr, newMaxStr]);
      onBlur();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        {icon && <div className="text-blue-600 w-6 h-6">{icon}</div>}

        <input
          type="number"
          className="w-28 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          value={tempVals[0]}
          placeholder={range.min.toString()}
          onChange={(e) => setTempVals([e.target.value, tempVals[1]])}
          onBlur={handleBlur}
        />

        <span className="text-gray-400 font-semibold select-none text-lg">–</span>

        <input
          type="number"
          className="w-28 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          value={tempVals[1]}
          placeholder={range.max.toString()}
          onChange={(e) => setTempVals([tempVals[0], e.target.value])}
          onBlur={handleBlur}
        />
      </div>

      <Slider
        range
        min={range.min}
        max={range.max}
        value={[
          parseFloat(tempVals[0]) || range.min,
          parseFloat(tempVals[1]) || range.max,
        ]}
        onChange={(value) => {
          const [min, max] = value as number[];
          setTempVals([min.toString(), max.toString()]);
        }}
        onAfterChange={handleBlur}
        allowCross={false}
        trackStyle={[{ backgroundColor: '#3b82f6', height: 6 }]}
        railStyle={{ backgroundColor: '#bfdbfe', height: 6 }}
        handleStyle={[
          {
            borderColor: '#3b82f6',
            backgroundColor: '#fff',
            boxShadow: '0 0 5px #3b82f6',
            height: 18,
            width: 18,
            marginTop: -6,
          },
          {
            borderColor: '#3b82f6',
            backgroundColor: '#fff',
            boxShadow: '0 0 5px #3b82f6',
            height: 18,
            width: 18,
            marginTop: -6,
          },
        ]}
      />
    </div>
  );
};

export default RangeSliderSection;
