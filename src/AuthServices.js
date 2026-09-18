import axios from 'axios';
const API_URL='http://localhost:3001/users';

export const registerUser=async({username,email,password})=>{
    try{
        const existingUser = await axios.get(API_URL, {
        params:  {email:email}
        });

        if(existingUser.data.length>0){
            throw new Error("User with this email already exists");
        }

        const response=await axios.post(API_URL,{
            username,
            email,
            password
        });
        return response.data;

    }catch(error){
        console.log("Registration Failed:",error.message);
        throw error;
    }
};

export const loginUser=async(email,password)=>{
    try{
        const response=await axios.get(API_URL,{
            params:{email:email}
        });

        if(response.data.length===0){
            throw new Error("User not found");
        }
            const user=response.data[0];
            if(user.password!==password){
                throw new Error("Invalid credentials");
            }
            localStorage.setItem('currentUser',JSON.stringify(user));
            return user;
        }catch(err){
            throw err;
        }
    }

export const logoutUser=()=>{
    localStorage.removeItem('currentUser');
};
