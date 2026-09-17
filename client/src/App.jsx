import { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceForm from './components/ServiceForm';
import BookingForm from './components/BookingForm';
import AppointmentList from './components/AppointmentList';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '' });
  const [bookingForm, setBookingForm] = useState({ customer_name: '', customer_phone: '', service_id: '', appointment_date: '', appointment_time: '', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const svcRes = await axios.get(`${API_URL}/services`);
      setServices(svcRes.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }

    try {
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

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`${API_URL}/services/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting service. It might be linked to an appointment.');
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

  const updateStatus = async (id, status) => {
    await axios.patch(`${API_URL}/appointments/${id}/status`, { status });
    fetchData();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Salon Booking System</h1>
      
      <ServiceForm 
        serviceForm={serviceForm} 
        setServiceForm={setServiceForm} 
        handleAddService={handleAddService} 
      />

      {/* Available Services List */}
      <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Available Services</h2>
        <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
          {services.map(s => (
            <li key={s.id} style={{ marginBottom: '10px' }}>
              <strong>{s.name}</strong> - NPR {s.price} ({s.duration} mins) 
              <button onClick={() => handleDeleteService(s.id)} style={{ marginLeft: '10px', background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <BookingForm 
        bookingForm={bookingForm} 
        setBookingForm={setBookingForm} 
        handleBookAppointment={handleBookAppointment} 
        services={services} 
      />

      <AppointmentList 
        appointments={appointments} 
        updateStatus={updateStatus} 
      />
    </div>
  );
}

export default App;