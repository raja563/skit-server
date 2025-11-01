import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEllipsisV, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const UserList = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const getUsersURL = `${BASE_URL}/api/users/`;
  const deleteUserURL = (id) => `${BASE_URL}/api/users/${id}/delete/`;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(getUsersURL);
      setUsers(res.data);
    } catch (error) {
      toast.error("🔴 Failed to load users");
    }
  };

  const handleMore = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("⚠️ Are you sure you want to delete this user?")) return;

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("🔐 You must be logged in to delete a user");
    return;
  }

  try {
    await axios.delete(deleteUserURL(id), {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    toast.success("🗑️ User deleted successfully");
    fetchUsers();
  } catch (error) {
    console.error(error);
    if (error.response?.status === 401) {
      toast.error("🔒 Unauthorized: Please login again");
    } else if (error.response?.status === 403) {
      toast.error("⛔ Forbidden: You don't have permission");
    } else {
      toast.error("❌ Failed to delete user");
    }
  }
};


  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Username', 'Email', 'Date Joined']],
      body: filteredUsers.map(u => [
        u.username,
        u.email,
        new Date(u.date_joined).toLocaleDateString()
      ]),
    });
    doc.save("user_list.pdf");
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map(u => ({
        Username: u.username,
        Email: u.email,
        Date_Joined: new Date(u.date_joined).toLocaleDateString(),
        Is_Superuser: u.is_superuser ? "Yes" : "No",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "user_list.xlsx");
  };

  return (
    <div className="fluid mt-2">
      <h3 className="text-center bg-success p-1 rounded">User Details</h3>

      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md="auto">
          <Button onClick={downloadPDF} variant="danger" className="me-2">Export PDF</Button>
          <Button onClick={downloadExcel} variant="success">Export Excel</Button>
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{indexOfFirst + index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              
              <td>
                <FaEllipsisV
                  className="mx-2 text-primary"
                  role="button"
                  onClick={() => handleMore(user)}
                />
                <FaTrash
                  className="text-danger"
                  role="button"
                  onClick={() => handleDelete(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for more info */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Is Staff:</strong> {selectedUser.is_staff ? "Yes" : "No"}</p>
              <p><strong>Is Superuser:</strong> {selectedUser.is_superuser ? "Yes" : "No"}</p>
              <p><strong>Date Joined:</strong> {new Date(selectedUser.date_joined).toLocaleString()}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Pagination */}
      <div className="d-flex w-100 justify-content-end m-1">
        <Button
          variant="light"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </Button>
        <span className="mx-3 align-self-center">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="light"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserList;
