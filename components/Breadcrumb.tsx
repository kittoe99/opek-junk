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
    <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200 sticky top-[72px] md:top-[92px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {/* Home Link */}
          <li>
            <Link 
              to="/" 
              className="flex items-center text-gray-500 hover:text-black transition-colors"
              aria-label="Home"
            >
              <Home size={16} />
            </Link>
          </li>

          {/* Breadcrumb Items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <React.Fragment key={index}>
                <li>
                  <ChevronRight size={16} className="text-gray-400" />
                </li>
                <li>
                  {isLast || !item.path ? (
                    <span className="font-semibold text-black" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <Link 
                      to={item.path} 
                      className="text-gray-500 hover:text-black transition-colors"
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
