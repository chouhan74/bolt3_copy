import React, { useEffect, useCallback } from 'react';

interface ProctoringSecurityProps {
  onViolation: (violation: string) => void;
}

const ProctoringSecurity: React.FC<ProctoringSecurityProps> = ({ onViolation }) => {
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      onViolation(`Tab switched at ${new Date().toISOString()}`);
    }
  }, [onViolation]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Detect common developer tools shortcuts
    const isDeveloperShortcut = (
      (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C')) ||
      event.key === 'F12' ||
      (event.ctrlKey && event.key === 'u') // View source
    );

    if (isDeveloperShortcut) {
      event.preventDefault();
      onViolation(`Developer tools attempt at ${new Date().toISOString()}`);
    }

    // Detect copy attempts
    if (event.ctrlKey && (event.key === 'c' || event.key === 'v')) {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 10) {
        onViolation(`Large copy operation detected at ${new Date().toISOString()}`);
      }
    }
  }, [onViolation]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    onViolation(`Right-click attempt at ${new Date().toISOString()}`);
  }, [onViolation]);

  const handleBlur = useCallback(() => {
    onViolation(`Window lost focus at ${new Date().toISOString()}`);
  }, [onViolation]);

  useEffect(() => {
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('blur', handleBlur);

    // Disable text selection on certain elements
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('blur', handleBlur);
      
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [handleVisibilityChange, handleKeyDown, handleContextMenu, handleBlur]);

  // This component doesn't render anything visible
  return null;
};

export default ProctoringSecurity;