import React from 'react';

function AppointmentList({ appointments, updateStatus }) {
  return (
    <section>
      <h2>Appointments</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt.id}>
              <td>{appt.customer_name}</td>
              <td>{appt.service_name}</td>
              <td>{new Date(appt.appointment_date).toLocaleDateString()}</td>
              <td>{appt.appointment_time}</td>
              <td>{appt.status}</td>
              <td>
                <select value={appt.status} onChange={(e) => updateStatus(appt.id, e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default AppointmentList;