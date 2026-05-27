import { MdOutlineGroups } from "react-icons/md";

const Dropdown = ({
  options = [],
  value,
  onChange,
  icon: Icon = MdOutlineGroups,
}) => {
  return (
    <div className="p-2 max-w-sm mx-auto">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2394db] text-lg" />
        )}

        <select
          id="select-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-400 bg-white p-2 pl-10 shadow-sm outline-none focus:border-[#2394db] focus:ring-2 focus:ring-[#2394db]"
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dropdown;
