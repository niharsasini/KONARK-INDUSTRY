const MenuColumn = ({ title, links }) => (
  <div>
    <p className="mb-3 font-semibold text-gray-900">{title}</p>
    <ul className="space-y-2 text-gray-600">
      {links.map((link) => (
        <li key={link} className="cursor-pointer hover:text-black transition">
          {link}
        </li>
      ))}
    </ul>
  </div>
);

export default MenuColumn;
