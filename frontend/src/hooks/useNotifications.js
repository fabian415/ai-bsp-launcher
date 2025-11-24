import { useEffect, useCallback } from 'react';
import { EventsOn } from '../../wailsjs/runtime/runtime';

export const useNotifications = () => {
  // State for in-app toast notifications (fallback)
  const showToast = useCallback((title, message, type = 'info') => {
    // Create a toast notification element
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__header">
        <strong>${title}</strong>
      </div>
      <div class="toast__body">${message}</div>
    `;
    
    // Add to document
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Auto-dismiss after duration
    const duration = type === 'error' ? 8000 : 5000;
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
        if (toastContainer.children.length === 0) {
          toastContainer.remove();
        }
      }, 300);
    }, duration);
  }, []);

  // Listen for notification events from backend
  useEffect(() => {
    const unsubscribe = EventsOn('notification', (data) => {
      const { title, message } = data;
      
      // Try to show desktop notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const notification = new Notification(title, {
            body: message,
            icon: '/icon.png', // App icon
            tag: 'bsp-launchpad',
          });
          
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (error) {
          console.error('Failed to show desktop notification:', error);
          // Fallback to toast
          showToast(title, message, title.toLowerCase().includes('fail') ? 'error' : 'success');
        }
      } else {
        // Fallback to in-app toast
        showToast(title, message, title.toLowerCase().includes('fail') ? 'error' : 'success');
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showToast]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Check if notifications are supported and permitted
  const checkPermission = useCallback(() => {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  }, []);

  return {
    showToast,
    requestPermission,
    checkPermission,
  };
};

