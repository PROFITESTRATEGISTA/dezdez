import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  // Add structured data for breadcrumbs
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: window.location.origin
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `${window.location.origin}${item.path}`
      }))
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex items-center flex-wrap">
          <li className="flex items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.isLast ? (
                <span className="text-blue-600 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.path} className="text-gray-600 hover:text-blue-600">
                    {item.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;