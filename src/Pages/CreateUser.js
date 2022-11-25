import {
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  makeStyles,
  Grid,
  IconButton,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { userContext } from "../App";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {InputAdornment} from "@material-ui/core";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles({
  mainWrapper: { padding: "2%", border: "1px solid #EEEEEE",borderRadius:'10px'},
  mainContainer: {
    height: "93.34027055150885vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {width:'100%',margin:'20px 0'}
});

const CreateUser = () => {
  const {
    data,
    setData,
    isUpdate,
    setIsUpdate,
    id,
    validation,
    hasError,
    setHasError,
  } = useContext(userContext);

  const { mainWrapper, mainContainer, inputWrapper} = useStyles();
  const [isPasswordVisible,setIsPasswordVisible] = useState({
    trigger:false,
    triggerType:'password'
  })

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setHasError({ ...hasError, [e.target.name]: "" });
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    validation(id);
    setIsUpdate(false);
    setHasError({});
  };

  // Array for creating input fields

  const createInput = (placeholder,value,eventName,errorMsg) => {
    return {placeholder,value,eventName,errorMsg}
  }
  
  let inputArray = [
    createInput("Enter User Name",data.name,"name",hasError.name),
    createInput("Enter Email",data.email,"email",hasError.email),
    createInput("Enter Mobile",data.mobile,"mobile",hasError.mobile),
    createInput("Enter Password",data.password,"password",hasError.password),
    createInput("Confirm  Password",data.confirmPassword,"confirmPassword",hasError.confirmPassword)
  ];

  const handleShowPassword = () => {
    setIsPasswordVisible((prev)=>({...prev,trigger:true,triggerType:'text'}))
  }

  const handleHidePassword = () => {
    setIsPasswordVisible((prev)=>({...prev,trigger:false,triggerType:'password'}))
  }

  const myIcon = (nameOfEvent) => {
    if(nameOfEvent==='password'||nameOfEvent==='confirmPassword'){
      return(
        <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleShowPassword}
          onMouseDown={handleHidePassword}
          edge="end"
        >
          { isPasswordVisible.trigger ? <VisibilityOffIcon style={{fontSize:'20px'}}/>:<VisibilityIcon style={{fontSize:'20px'}} />}
        </IconButton>
      </InputAdornment>
      )
    }else{
      return null
    }
  }

  

  return (
      <Grid className={mainContainer} container>
        <Grid item xs={11} sm={5} md={5} lg={3} xl={3} className={mainWrapper}>
        <form
          autoComplete="off"
          noValidate
          onSubmit={(e) => handleSubmit(e, id)}
        >
          {inputArray.map((ele,i) => (
            <div key={i} className={inputWrapper}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={ele.placeholder}
                type={(ele.eventName==='password'||ele.eventName==='confirmPassword')?isPasswordVisible.triggerType:'text'}
                name={ele.eventName}
                value={ele.value}
                onChange={handleChange}
                required
                InputProps={{endAdornment:myIcon(ele.eventName)}}
              />
              {ele.errorMsg && (
                <Typography variant="p" style={{fontSize:'14px'}} color="secondary">
                  {ele.errorMsg}
                </Typography>
              )}
            </div>
          ))}
          <div>

          <div className={inputWrapper}>
          <RadioGroup row name="gender" onChange={handleChange}>
            <FormControlLabel value='male' checked={data.gender==='male'} control={<Radio />} label="Male" />
            <FormControlLabel value='female' control={<Radio />} label="Female" checked={data.gender==='female'}/>
            <FormControlLabel value='other' checked={data.gender==='other'} control={<Radio />} label="Other" />
          </RadioGroup>
          {hasError.gender && (
            <Typography variant="p" color="secondary">
              {hasError.gender}
            </Typography>
          )}
            </div>
          </div>
            <Button fullWidth variant="contained" color="primary" type="submit">
              {isUpdate ? "Update" : "Register"}
            </Button>
        </form>
        </Grid>
      </Grid>
  );
};
export default CreateUser;
