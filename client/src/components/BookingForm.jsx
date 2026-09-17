import React from 'react';

function BookingForm({ bookingForm, setBookingForm, handleBookAppointment, services }) {
  return (
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
  );
}

export default BookingForm;