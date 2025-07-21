import React, { useEffect, useState } from "react";
import "./User.css";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/person/");
      setUsers(response.data);
    };

    fetchData();
  }, []);

  // delete user
  const deleteUser = async(pk) => {
     const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;
    await axios.delete(`http://127.0.0.1:8000/api/person_edit/${pk}/`)
      .then((response) => {
        // ye apke frontend se data ko remmove krega
        setUsers((prevUser)=>prevUser.filter((user)=>user.id !== pk));
        console.log(response);
        toast.error(response.data.msg, {position:"top-center"});
      })
      .catch((error) => console.log(error));

      };

  return (
    <>
      <Header/>
    <div className="userTable">
      <Link to={"/add"} className="addButton">
        Add User
      </Link>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>User Id</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.fname} {user.lname}
                </td>
                <td>{user.email}</td>
                <td className="actionButton">
                  <button onClick={() => deleteUser(user.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <Link to={`/edit/` + user.id}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
      <Footer/>
    </>
  );
};

export default User;
