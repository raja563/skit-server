import React, { useContext, useState } from 'react'
// import authContext from '../Context/authContext'

const Login = () => {
    const [credentials, setCredentials]=useState({
        username:'',
        password:''
    })
    
    // const {login} = useContext();

    const handleSubmit=(e)=>{
        e.preventDefault();

        login(credentials);
        
        // console.log(credentials);
        
    }
  return (
    <div className="fluid">
      <div className="row">
        <div className="col-sm-8 col-lg-4">
          <form action="" onSubmit={handleSubmit} >
            <h1>LOGIN FORM</h1>
            <input type="text" value={credentials.username} placeholder='Username' onChange={(e)=>setCredentials({...credentials,username:e.target.value})}/>
            <input type="text" value={credentials.password} placeholder='Password' onChange={(e)=>setCredentials({...credentials,password:e.target.value})}/>
            <button type='submit'>Login</button>
      </form>
        </div>
      </div>
    </div>
  )
}

export default Login
