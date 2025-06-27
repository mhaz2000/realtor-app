import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export type Range = { min: number; max: number };

type RangeSliderSectionProps = {
  label: string;
  range: Range;
  tempVals: [string, string];
  setTempVals: (vals: [string, string]) => void;
  onBlur: () => void;
};

const RangeSliderSection: React.FC<RangeSliderSectionProps> = ({
  label,
  range,
  tempVals,
  setTempVals,
  onBlur,
}) => {
  return (
    <div className="flex-1 min-w-[280px] p-5 bg-blue-50 rounded-2xl border border-blue-300 shadow-inner space-y-3">
      <label className="block font-semibold text-blue-700 text-sm">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          className="w-full rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tempVals[0]}
          placeholder={`${range.min}`}
          onChange={(e) => setTempVals([e.target.value, tempVals[1]])}
          onBlur={onBlur}
        />
        <span className="text-blue-500">–</span>
        <input
          type="number"
          className="w-full rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tempVals[1]}
          placeholder={`${range.max}`}
          onChange={(e) => setTempVals([tempVals[0], e.target.value])}
          onBlur={onBlur}
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
        onChangeComplete={onBlur}
        allowCross={false}
        trackStyle={[{ backgroundColor: '#3b82f6', height: 6 }]}      // blue track
        railStyle={{ backgroundColor: '#bfdbfe', height: 6 }}          // light blue rail
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
