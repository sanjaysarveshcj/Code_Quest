import axios from "axios";

const API=axios.create({
    baseURL:"http://localhost:5000"
});

API.interceptors.request.use((req)=>{
    if(localStorage.getItem("Profile")){
        req.headers.Authorization=`Bearer ${
            JSON.parse(localStorage.getItem("Profile")).token
        }`;
    }
    return req;
})

export const getUserPoints =(userid)=> API.get(`/user/userpoints/${userid}`)

export const login=(authdata)=>API.post("user/login",authdata);
export const signup=(authdata)=>API.post("user/signup",authdata);
export const getallusers=()=> API.get("/user/getallusers");
export const updateprofile=(id,updatedata)=>API.patch(`user/update/${id}`,updatedata)

export const resetpassword = (emailOrPhone) => API.post("user/reset-password", { emailOrPhone });


export const postquestion=(questiondata)=>API.post("/questions/Ask",questiondata);
export const getallquestions=()=>API.get("/questions/get");
export const deletequestion=(id)=>API.delete(`/questions/delete/${id}`);
export const votequestion=(id,value)=>API.patch(`/questions/vote/${id}`,{value});

export const sendOtp = (email) => API.post("/api/send-otp", email);
export const verifyOtp = (otpData) => API.post("/api/verify-otp", otpData);

export const postanswer=(id,noofanswers,answerbody,useranswered)=>API.patch(`/answer/post/${id}`,{noofanswers,answerbody,useranswered});
export const deleteanswer=(id,answerid,noofanswers)=>API.patch(`/answer/delete/${id}`,{answerid,noofanswers});
export const voteAnswer = (id, answerid, value) => API.patch(`/answer/vote/${id}`, {answerid, value });
  
