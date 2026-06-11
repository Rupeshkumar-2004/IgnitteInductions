import { useState, useEffect } from 'react';

// Simple in-memory state for toasts
let memoryState = [];
// Array of state-setter functions from all active useToast hooks
const listeners = [];

/**
 * Triggers a new toast notification.
 * @param {Object} props - Toast properties
 * @param {string} props.title - The title of the toast
 * @param {string} props.description - The description of the toast
 * @param {'default'|'destructive'} [props.variant='default'] - The visual style
 */
export const toast = ({ title, description, variant = 'default' }) => {
  const id = Date.now().toString();
  const newToast = { id, title, description, variant };
  
  // Add toast to memory and notify listeners
  memoryState = [...memoryState, newToast];
  listeners.forEach((listener) => listener(memoryState));

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    memoryState = memoryState.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(memoryState));
  }, 5000);
};

export const useToast = () => {
  const [toasts, setToasts] = useState(memoryState);

  // Subscribe to changes in memoryState
  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const dismiss = (id) => {
    memoryState = memoryState.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(memoryState));
  };

  return { toasts, toast, dismiss };
};