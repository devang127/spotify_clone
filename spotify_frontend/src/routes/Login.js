
import { Icon } from '@iconify/react';
import TextInput  from '../components/shared/TextInput.js'  
import Passwordinput from '../components/shared/Passwordinput.js'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {useCookies} from "react-cookie"
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers.js';


const LoginComponent = () =>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cookies, setCookie] = useCookies(["token"])
    const navigate = useNavigate();
    const login = async () =>{
            
            const data = {email, password}
            const response = await makeUnauthenticatedPOSTRequest("/auth/login", data)
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
            <div className='font-bold mb-12'>
                To Continue, log in to Spotify.
            </div>
                <TextInput 
                    label="Email address or username" 
                    placeholder="Email address or username"
                    className="my-5"
                    value={email}
                    setValue={setEmail}
                />

                <Passwordinput 
                    label="Password" 
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                />
                <div className='w-full w-full flex items-center justify-end my-8'>
                <button className='bg-green-400  font-semibold p-2 px-6 rounded-full'
                    onClick={(e)=>{
                        e.preventDefault()
                        login()
                    }}
                    >LOG IN</button>
                </div>
                <div className='w-full border border-solid border-gray-300'></div>
                <div className='font-semibold my-4 text-lg'>
                    Don't have an account?
                </div>
                <div className='w-full flex items-center justify-center'>
                <div 
                    className='text-gray-500 font-semibold border border-gray-400 w-full flex items-center justify-center py-3.5 rounded-full'>
                        <Link to="/signup">
                            SIGN UP FOR SPOTIFY
                        </Link>
                </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent