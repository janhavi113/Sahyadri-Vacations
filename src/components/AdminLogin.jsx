import React from 'react'
import { useForm } from "react-hook-form"
import { redirect,useNavigate } from "react-router-dom";

const AdminLogin = () => {

  const {
    register,
    handleSubmit,
    setError,    
    formState: { errors, isSubmitting },
  } = useForm();
 const navigate = useNavigate();
  
  const onSubmit = async (data) => {
    let r = await fetch(`http://localhost:3000/admin-login`, {method: "POST",  headers: {
      "Content-Type": "application/json", 
    }, body: JSON.stringify(data)})
    let res = await r.json()
    
    console.log(data, res)
     if(data.password !== res[0].Password){
       setError("myform", {message: "Invalid Password and UserName. Please contact Syatem Admin"})
     }
     else{
      navigate("/dashboard");      
     }
    // if(data.username === "rohan"){
    //   setError("blocked", {message: "Sorry this user is blocked"})
    // }
  }
  
  return (
    <> 
    {isSubmitting && <div>Loading...</div>}
       <div className="container">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <input placeholder='username' {...register("username", { required: {value: true, message: "This field is required"}, })} type="text"   />
          <br />
          <input placeholder='password'  {...register("password", {minLength: {value: 7, message: "Min length of password is 7"},})} type="password"/>
          {errors.password && <div className='red'>{errors.password.message}</div>}
          <br />
          <input disabled={isSubmitting} type="submit" value="Submit" />
          {errors.myform && <div className='red'>{errors.myform.message}</div>}
          {errors.blocked && <div className='red'>{errors.blocked.message}</div>}
        </form>
       </div>
    </>
  )
}

export default AdminLogin
