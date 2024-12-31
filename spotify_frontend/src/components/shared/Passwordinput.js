const TextInput = ({label, placeholder,value , setValue}) =>{
    return(
        <div className="flex flex-col space-y-1 w-full">
            <label 
                for={label}
                className="font-semibold"
            >{label}</label>
            <input 
                type="password" 
                placeholder={placeholder} 
                className="p-2.5 border border-solid border-gray-500 rounded placeholder-gray-500"
                id={label}
                value={value}
                onChange={(e)=>{
                    setValue(e.target.value)
                }}
                required
            />
        </div>
    )
}

export default TextInput;