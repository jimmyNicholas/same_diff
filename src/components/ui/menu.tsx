interface MenuProps {
  items: {
    label: string;
    href: string;
    active: boolean;
  }[];
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: (href: string) => void;
}

const Menu = ({ items, size = "md", onClick }: MenuProps) => {
  return (
    <ul className={`menu menu-${size} bg-base-200 rounded-box`}>
      {items.map((item) => (
        <li key={item.label} className={`p-2 cursor-pointer ${item.active ? "bg-secondary text-secondary-content" : ""}`}>
          <a onClick={() => onClick?.(item.href)}>{item.label}</a>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
