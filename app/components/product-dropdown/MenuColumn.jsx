"use client";
import { useRouter } from "next/navigation";

const MenuColumn = ({ title, links, isNavigable }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <ul className="flex flex-col gap-1 text-gray-600 text-sm">
        {links.map((link, index) => {
          if (isNavigable) {
            return (
              <li
                key={index}
                onClick={() => router.push(link.path)}
                className="cursor-pointer hover:text-sky-500 transition"
              >
                {link.label}
              </li>
            );
          } else {
            return (
              <li key={index} className="cursor-default">
                {link}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default MenuColumn;
