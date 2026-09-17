import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Forms state
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '' });
  const [bookingForm, setBookingForm] = useState({ customer_name: '', customer_phone: '', service_id: '', appointment_date: '', appointment_time: '', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Services safely
      const svcRes = await axios.get(`${API_URL}/services`);
      setServices(svcRes.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }

    try {
      // Fetch Appointments safely
      const apptRes = await axios.get(`${API_URL}/appointments`);
      setAppointments(apptRes.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/services`, serviceForm);
      setServiceForm({ name: '', price: '', duration: '' });
      fetchData();
      alert('Service Added');
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding service');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/appointments`, bookingForm);
      setBookingForm({ customer_name: '', customer_phone: '', service_id: '', appointment_date: '', appointment_time: '', notes: '' });
      fetchData();
      alert('Appointment Booked');
    } catch (err) {
      alert(err.response?.data?.error || 'Error booking appointment');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`${API_URL}/services/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting service. It might be linked to an appointment.');
    }
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${API_URL}/appointments/${id}/status`, { status });
    fetchData();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Salon Booking System</h1>
      
      {/* ADD SERVICE FORM */}
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Add Service</h2>
        <form onSubmit={handleAddService}>
          <input required placeholder="Service Name" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} />
          <input required type="number" placeholder="Price" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} />
          <input required type="number" placeholder="Duration (mins)" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} />
          <button type="submit">Add Service</button>
        </form>
      </section>

      {/* SERVICES LIST */}
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Available Services</h2>
        <ul>
          {services.map(s => (
            <li key={s.id} style={{ marginBottom: '10px' }}>
              <strong>{s.name}</strong> - NPR {s.price} ({s.duration} mins) 
              <button onClick={() => handleDeleteService(s.id)} style={{ marginLeft: '10px', background: 'red', color: 'white' }}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* BOOK APPOINTMENT FORM */}
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Book Appointment</h2>
        <form onSubmit={handleBookAppointment}>
          <input required placeholder="Customer Name" value={bookingForm.customer_name} onChange={e => setBookingForm({...bookingForm, customer_name: e.target.value})} />
          <input required placeholder="Phone" value={bookingForm.customer_phone} onChange={e => setBookingForm({...bookingForm, customer_phone: e.target.value})} />
          
          <select required value={bookingForm.service_id} onChange={e => setBookingForm({...bookingForm, service_id: e.target.value})}>
            <option value="">Select Service</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name} - NPR {s.price}</option>)}
          </select>
          
          <input required type="date" value={bookingForm.appointment_date} onChange={e => setBookingForm({...bookingForm, appointment_date: e.target.value})} />
          <input required type="time" value={bookingForm.appointment_time} onChange={e => setBookingForm({...bookingForm, appointment_time: e.target.value})} />
          <input placeholder="Notes (Optional)" value={bookingForm.notes} onChange={e => setBookingForm({...bookingForm, notes: e.target.value})} />
          
          <button type="submit">Book Now</button>
        </form>
      </section>

      {/* APPOINTMENTS LIST */}
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
    </div>
  );
}

export default App;