import React, { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../app/features/admin/notificationSlice";
import { Col, Container, Row } from "react-bootstrap";
import { STATUSES } from "../app/features/userSlice";
import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom";

const NotificationList = () => {
    const notifications = useSelector(state => state.notifications.data?.notifications)
    const status = useSelector(state => state.notifications.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleDismiss = (id) => {
        // setNotifications(notifications.filter((notification) => notification.id !== id));
        navigate(`/vendor/notification/${id}`)
    };


    useEffect(() => {
        dispatch(fetchNotifications())
    }, [])
    return (
        <Container className="my-4">
            <h2 className="mb-4">Notifications</h2>
            <Row>
                <Col md={8} className="mx-auto">
                    {notifications?.length > 0 ? (
                        notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                title={notification.title}
                                onDismiss={() => handleDismiss(notification._id)}
                            />
                        ))
                    ) : status === STATUSES.LOADING ? <><Loader /></> : (
                        <p className="text-center text-muted">
                            You have no new notifications.
                        </p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default NotificationList;
