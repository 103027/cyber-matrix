import React, { createContext, useContext, useRef } from "react";
import NotificationSnackbar from "../Components/Notification.jsx";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const snackbarRef = useRef();

  const showNotification = (message) => {
    snackbarRef.current.showSnackbar(message);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationSnackbar ref={snackbarRef} />
    </NotificationContext.Provider>
  );
};
