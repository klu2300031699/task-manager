import React, { useState } from 'react';
import './QuickActions.css';

const QuickActions = ({ onExportTasks, onImportTasks, onClearCompleted }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleExport = () => {
    onExportTasks();
    setIsOpen(false);
  };

  const handleImport = () => {
    onImportTasks();
    setIsOpen(false);
  };

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to delete all completed tasks?')) {
      onClearCompleted();
      setIsOpen(false);
    }
  };

  return (
    <div className="quick-actions">
      <div className={`quick-actions-menu ${isOpen ? 'open' : ''}`}>
        <button className="action-btn export-btn" onClick={handleExport} title="Export Tasks">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Export Tasks</span>
        </button>

        <button className="action-btn import-btn" onClick={handleImport} title="Import Tasks">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Import Tasks</span>
        </button>

        <button className="action-btn clear-btn" onClick={handleClearCompleted} title="Clear Completed">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Clear Completed</span>
        </button>
      </div>

      <button 
        className={`quick-actions-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        title="Quick Actions"
      >
        <svg className="icon-plus" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg className="icon-close" viewBox="0 0 24 24" fill="none">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default QuickActions;
