
import { Icon } from '@iconify/react';
import TextInput  from '../components/shared/TextInput.js'  
import {useCookies} from "react-cookie"
import Passwordinput from '../components/shared/Passwordinput.js'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers.js';
import { useHistory } from 'react-router-dom';
const SignupComponent = () =>{

    const [email, setEmail] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [cookies, setCookie] = useCookies(["token"])
    const navigate = useNavigate();

    const signUp = async () =>{
        if (email !== confirmEmail){
            alert("Emails do not match")
            return;
        }
        const data = {email, password, username, firstName, lastName}
        const response = await makeUnauthenticatedPOSTRequest("/auth/register", data)
        if (response && !response.error){
            console.log(response)
            const token = response.token
            const date = new Date()
            date.setDate(date.getDate() + 30)
            setCookie("token", token, {path:"/", expires: date})
            alert("Registration Successful")
            navigate("/home")
        } else {
            alert("Authentication Failed")
        }
    }
    

    return ( 
        <div className="w-full h-full flex flex-col items-center">
            <div className=' flex flex-col items-center w-full logo p-5 border-b border-solid border-gray-300'>
            <Icon icon="logos:spotify" width="150"/>
            </div>
            <div className='inputRegion w-1/4 py-5 flex flex-col items-center justify-center'>
            <div className='font-bold mb-12 text-2xl'>
                sign up for free to start listening.
            </div>
                <TextInput 
                    label="Email address" 
                    placeholder="Enter your email."
                    className="my-6"
                    value={email}    
                    setValue={setEmail}
                    
                />
                <TextInput 
                    label="Confirm Email Address." 
                    placeholder="Enter Your Email Address"
                    className="mb-6"   
                    value={confirmEmail}    
                    setValue={setConfirmEmail} 
                />
                <TextInput 
                    label="Username." 
                    placeholder="Enter Your Username"
                    className="mb-6"    
                    value={username}    
                    setValue={setUsername}
                />

                <Passwordinput 
                    label="Create a Password" 
                    placeholder="Create a Password"
                    value={password}
                    setValue={setPassword}
                />
                <div className='w-full flex flex-col justify-between items-center '>
                    <TextInput 
                        label="First Name" 
                        placeholder="First Name"
                        className="mt-6"    
                        value={firstName}
                        setValue={setFirstName}
                        required               
                        />
                    <TextInput 
                        label="Last Name" 
                        placeholder="Last Name"
                        className="mt-6"    
                        value={lastName}
                        setValue={setLastName}
                        required
                        />
                </div>

                <div className='w-full w-full flex items-center justify-center my-8'>
                    <button className='bg-green-400  font-semibold p-2 px-6 rounded-full'
                        onClick={(e)=>{
                            e.preventDefault()
                            signUp()
                        }}
                    >SIGN UP</button>
                </div>
                <div className='w-full border border-solid border-gray-300'></div>
                <div className='font-semibold my-4 text-lg'>
                    Already have an account?
                </div>
                <div className='w-full flex items-center justify-center'>
                <div 
                    className='text-gray-500 font-semibold border border-gray-400 w-full flex items-center justify-center py-3.5 rounded-full'>
                        <Link to="/login">
                            LOG IN INSTED
                        </Link>

                </div>
                </div>
            </div>
        </div>
    )
}

export default SignupComponent;