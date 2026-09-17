import React from 'react';

function ServiceForm({ serviceForm, setServiceForm, handleAddService }) {
  return (
    <section style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
      <h2>Add Service</h2>
      <form onSubmit={handleAddService}>
        <input required placeholder="Service Name" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} />
        <input required type="number" placeholder="Price" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} />
        <input required type="number" placeholder="Duration (mins)" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} />
        <button type="submit">Add Service</button>
      </form>
    </section>
  );
}

export default ServiceForm;