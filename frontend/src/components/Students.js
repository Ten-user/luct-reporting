// frontend/src/components/Students.js
import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role === 'pl' || role === 'prl') {
      API.get('/students')
        .then(res => setStudents(res.data))
        .catch(err => {
          console.error('❌ Error fetching students:', err);
          setStudents([]);
        });
    }
  }, [role]);

  if (role !== 'pl' && role !== 'prl') {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div>
      <h3>Students</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
