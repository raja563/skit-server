import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import "./add.css";
const Add = () => {

const navigate=useNavigate();
const users={
    fname:"",
    lname:"",
    email:"",
    password:""
}
const [user,setUser]=useState(users)

//to handle the input value 
const  inputHandler=(e)=>{
    const {name,value}=e.target;
    // console.log(name);
    // console.log(value);
    //iska mtlb hai jo bhi purana data wo rhe aur jo data name aur value se aa rha hai usko update karte jao
    setUser({...user,[name]:value});

    // console.log(user);

}

// after handle the input value submit the form 
// const create_url="http://localhost:8000/api/v1/create"
const submitForm=async(e)=>{
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/api/person/",user)
    .then((response)=>{
      toast.success(response.data.msg,{position:"top-right"})
      console.log(response);
      navigate('/addUser');

    }).catch(error=>console.log(error));
}


  return (
    <div className="addUser">
      <Link to={"/addUser"}>Back</Link>
      <h3>Add New User</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="fname">First Name</label>
          <input
            type="text"
            onChange={inputHandler}
            placeholder="Enter first name"
            id="fname"
            autoComplete="off"
            name="fname"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            onChange={inputHandler}
            placeholder="Enter last name"
            id="lname"
            autoComplete="off"
            name="lname"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            onChange={inputHandler}
            placeholder="Enter email"
            id="email"
            autoComplete="off"
            name="email"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            onChange={inputHandler}
            placeholder="Enter password"
            id="password"
            autoComplete="off"
            name="password"
          />
        </div>
        <div className="inputGroup">
          <button type="submit">Add User</button>
        </div>
      </form>
    </div>
  );
};

export default Add;
