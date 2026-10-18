'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SpaCard from '../layouts/SpaCard';

const ServiceList = ({ services }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(services.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={currentPage}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <motion.div key={item._id || index} variants={itemVariants}>
              <SpaCard item={item} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-zinc-500">
            No services found. Please add data to your database.
          </div>
        )}
      </motion.div>
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  currentPage === index + 1
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
