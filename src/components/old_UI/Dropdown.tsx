interface DropdownProps {
  options: string[];
}

const Dropdown = ({ options }: DropdownProps) => {
  return <div className="dropdown">
    <label tabIndex={0} className="btn m-1">Click</label>
    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      {options.map((option) => (
        <li key={option}>{option}</li>
      ))}
    </ul>
  </div>;
};

export default Dropdown;