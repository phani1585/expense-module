import React,{useState,createContext,useEffect} from "react";
import NavBar from "./components/NavBar";
import UsersList from "./Pages/UsersList";
import CreateUser from "./Pages/CreateUser";
import axios from "axios";
import * as yup from 'yup';
import { Routes,Route } from "react-router-dom";
import { ThemeProvider,createTheme, Paper } from '@material-ui/core';
import ReadExcel from "./Pages/ReadExcel";




export const userContext = createContext()




function App() {

  
  let person = {
    name : '',
    email:'',
    mobile:'',
    password:'',
    confirmPassword:'',
    gender:'',
  }
  
  
  const [users, setUsers] = useState([]);
  const [isUpdate,setIsUpdate]= useState(false)
  const [id,setId] = useState()
  const [data,setData]=useState(person)
  const [hasError,setHasError]=useState({})
  let darkTheme = JSON.parse(localStorage.getItem('darktheme'))
  const [isDark,setIsDark]=useState(darkTheme||false)


  useEffect(()=>{
    localStorage.setItem('darktheme',JSON.stringify(isDark))
  },[isDark])

    //schema for Registration form
    const formValidation = yup.object().shape({
      name : yup.string().required('Please Enter Name'),
      email:yup.string().email().required('Please Enter Email').matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,'Invaild Email Format'),
      mobile:yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,'Mobile Number is Not Valid').min(10).required('Please Enter Mobile No'),
      password:yup.string().min(8).required('Please Enter Password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'),
      confirmPassword:yup.string().required("This Field Can't be Empty").oneOf([yup.ref("password")],'Password should match'),
      gender:yup.string().required('Please Select Gender')
    })
  
    
  
  
    const getData = () => {
      axios.post('http://192.168.15.111:5000/user/getAllUsers', new FormData()).then(response=>setUsers(response.data.data)).catch(error=>console.log(error))
    }
  
    useEffect(()=>{
      getData()
    },[]) 
  
    const handleDelete = (id) => {
      const body = new FormData()
      body.append('id',id)
      axios.post('http://192.168.15.111:5000/user/deleteUser',body).catch(response => console.log(response))
      getData()
    }
  
    const handleEdit =(id) => {
      let index = users.findIndex(ele=>ele.id===id)
      setData(users[index])
      setIsUpdate(true)
      setId(id)
    }
  
    const postData = async(id) => {
      const body = new FormData();
      body.append("name", data.name);
      body.append("email", data.email);
      body.append("mobile", data.mobile);
      body.append("password", data.password);
      body.append("confirmPassword", data.confirmPassword);
      body.append("gender", data.gender);
      isUpdate && body.append("id", id)
      await axios
      .post("http://192.168.15.111:5000/user/submitUser", body)
      .catch((error) => console.log(error,'form post data'));
    };
  
    async function validation(id) {
      const checkErrors = await formValidation.validate(data,{abortEarly:false}).catch((e)=>e)
      if (checkErrors.inner !== undefined){
        const errorMsg = [...checkErrors.inner].reduce((a,b)=>{
          a[b.path] = b.message;
          return a
        },{})
        setHasError(errorMsg)
      }else {
        postData(id)
        getData(id)
        setData(person);
      }
    }


const theme = createTheme({
    palette:{
      // primary:{
      //   main: isDark===true ? '#000':'#3f51b5'
      // },
      type: isDark===true ? 'dark':'light',
    }
})


  return (
    <ThemeProvider theme={theme}>
      <Paper style={{minHeight:'100vh'}}>
        <userContext.Provider value={{getData,isDark,setIsDark,users,setUsers,handleDelete,handleEdit,data,setData,person,isUpdate,setIsUpdate,id,setId,validation,hasError,setHasError}}>
        <NavBar/>
        <Routes>
          <Route path="/" element={<CreateUser/>}/>
          <Route path="/user_list" element={<UsersList/>}/>
          <Route path="/import_excel" element={<ReadExcel/>}/>
        </Routes>
        </userContext.Provider>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
