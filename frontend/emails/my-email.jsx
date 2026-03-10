import React from 'react';
import { Html, Head, Body, Container, Text, Hr } from '@react-email/components';

export const BookingConfirmationEmail = ({ patientName, doctorName, date, timeSlot, issue }) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', padding: '20px' }}>
      <Container style={{ maxWidth: '600px', margin: 'auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
        <h1>🩺 HealthSpectra</h1>
        <Text>Hi {patientName},</Text>
        <Text>Your appointment has been confirmed:</Text>
        <ul>
          <li><strong>Doctor:</strong> {doctorName}</li>
          <li><strong>Date:</strong> {date}</li>
          <li><strong>Time:</strong> {timeSlot}</li>
          <li><strong>Issue:</strong> {issue}</li>
        </ul>
        <Text>Thank you for using HealthSpectra!</Text>
        <Hr />
        <Text style={{ fontSize: '12px', color: '#8898aa' }}>HealthSpectra Team</Text>
      </Container>
    </Body>
  </Html>
);

export default BookingConfirmationEmail;
