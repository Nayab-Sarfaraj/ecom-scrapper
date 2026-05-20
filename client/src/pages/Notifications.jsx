import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "../app/features/admin/notificationSlice";
import { STATUSES } from "../app/features/userSlice";
import Loader from "../components/Loader/Loader";
import NotificationCard from "../components/NotificationCard";
import "./vendor.css";

const Notifications = () => {
  const notifications = useSelector(
    (state) => state.notifications.data?.notifications
  );
  const status = useSelector((state) => state.notifications.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>Notifications</h1>
            <p>Customer inquiries and product requests in your area</p>
          </div>
        </div>

        <Row>
          <Col md={8} className="mx-auto">
            {status === STATUSES.LOADING ? (
              <Loader />
            ) : notifications?.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  title={notification.title}
                  onDismiss={() =>
                    navigate(`/vendor/notification/${notification._id}`)
                  }
                />
              ))
            ) : (
              <div className="vendor-card">
                <div className="vendor-empty">
                  <div className="empty-icon">
                    <i className="bi bi-bell"></i>
                  </div>
                  <h3>All caught up</h3>
                  <p>You have no new notifications right now.</p>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Notifications;
