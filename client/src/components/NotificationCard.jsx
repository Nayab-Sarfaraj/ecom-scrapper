import React from "react";
import "../pages/vendor.css";

const NotificationCard = ({ title, onDismiss }) => {
  return (
    <div className="notif-card" onClick={onDismiss} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onDismiss()}>
      <div className="notif-icon">
        <i className="bi bi-bell"></i>
      </div>
      <div className="notif-body">
        <h4>{title || "New notification"}</h4>
        <p>Tap to view details</p>
      </div>
      <div className="notif-arrow">
        <i className="bi bi-chevron-right"></i>
      </div>
    </div>
  );
};

export default NotificationCard;
