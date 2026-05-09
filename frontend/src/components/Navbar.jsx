// import React from 'react'

// function Navbar() {
//   return (
//     <div className='h-16 w-full bg-white shadow-md flex items-center px-6 rounded-lg'>
//       Navbar
//     </div>
//   )
// }

// export default Navbar


// import React from 'react'

// function Navbar() {
//   return (
//     <div className='h-16 w-full bg-white shadow-md flex items-center px-6 rounded-lg'>
//       Navbar
//     </div>
//   )
// }

// export default Navbar
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* logo */}
            <div className="shrink-0 flex items-center">
              <Link to="/">
                <span className="text-2xl font-bold text-green-600">Project Management</span>
              </Link>
            </div>
          </div>
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center sm:space-x-8">

              <a
                href="/projects"
                className="border-transparent text-gray-500
                 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Projects
              </a>
              
              <a
                href="#"
                className="border-transparent text-gray-500
                 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Tasks
              </a>
              
              <a
                href="#"
                className="border-transparent text-gray-500
                 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Team
              </a>
            </div>
        </div>
      </div>

      
    </nav>
  );
}

export default Navbar;
