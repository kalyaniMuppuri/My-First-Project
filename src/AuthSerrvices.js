import axios from 'axios';
const API_URL='http://localhost:3001/users';

export const registerUser=async(userData)=>{
    try{
        const existingUser = await axios.get(API_URL, {
        params: {
            email: userData.email
        }
        });

        if(existingUser.data.length>0){
            throw new Error("An account with this email already exist \n please check and try again");

        }

        const response=await axios.post(API_URL,userData);
        return response.data;

    }catch(error){
        console.error("RegistrationFailed:",error.message);
        throw error;
    
    }
};

export const loginUser=async(email,password)=>{
    try{
        const response=await axios.get(API_URL,{
            params:{
                email:email,
                password:password
            }
        });

        if(response.data.length>0){
            const user=response.data[0];
            localStorage.setItem('currentUser',JSON.stringify(user));
            return user;
        }
        else{
            throw new Error("Invalid Credentials");

        }
    }catch(error){
        console.error("Login error:",error.message);
        throw error;
    }
};

export const logoutUser=()=>{
    localStorage.removeItem('currentUser');
};