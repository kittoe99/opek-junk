import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="pt-10 pb-2">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <ol className="flex items-center gap-2 text-xs">
          <li>
            <Link
              to="/"
              className="flex items-center text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Home"
            >
              <Home size={13} strokeWidth={1.5} />
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <li>
                  <ChevronRight size={12} className="text-gray-300" strokeWidth={1.5} />
                </li>
                <li>
                  {isLast || !item.path ? (
                    <span className="text-gray-900" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
