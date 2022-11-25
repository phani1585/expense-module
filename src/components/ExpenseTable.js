import React, {useState} from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  IconButton,
  Typography,
  Container,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {useContext} from 'react'
import {tableContext} from '../Pages/UsersList'
import SaveIcon from '@material-ui/icons/Save';
import axios from "axios";
import * as yup from 'yup'   

const useStyles = makeStyles({
  container_with_scrolls:{
    overflow:'auto',margin:'10px',width:'500px', minHeight:'500px',maxHeight:'500px', padding:'10px',
    overflowX:'scroll',
    '&::-webkit-scrollbar':{
        width:0,
    }
  },
  TotalExpensesWrapper:{padding:'15px',display:'flex',justifyContent:'space-between',alignItems:'center'},
  errorLabel:{color: 'red', fontSize: '12px', fontWeight: '400'}
})


//validation schema for Expense form
const expenseValidation = yup.array().of(yup.object({
  expensiveName: yup.string().required("is Required !"),
  expensiveCost: yup.number().typeError('Invalid Amount').required("is Required !")
}))


const ExpenseTable = () => {
  const {container_with_scrolls,TotalExpensesWrapper,errorLabel}=useStyles()
  const {expenseInput,setExpenseInput,userObject,setOpen} = useContext(tableContext)
  const [errors, setErrors] = useState({});

  //This is for displaying the total in the table footer
  let total = expenseInput.reduce((a,b)=>(a+Number(b.expensiveCost)),0)
  //end


  const handleExpenseChange = (i,e) => {
    const newExpense = [...expenseInput]
    newExpense[i] = {...newExpense[i],[e.target.name]:e.target.value}
    setExpenseInput(newExpense)
  }

  const handleSaveExpense = async () => {
    const validation = await expenseValidation.validate(expenseInput, {abortEarly: false}).catch((err)=>{
      return err
    })
    if(validation.inner!==undefined){
      let error = validation.inner.reduce((a,b)=>{
        a[b.path]=b.message
        return a
      },{})
      setErrors(error)
    }else{
      setErrors({})
      const body = new FormData()
      body.append('id',userObject.id)
      body.append('expensives',JSON.stringify(expenseInput))
      axios.post('http://192.168.15.111:5000/user/submitExpensives',body).catch(error=>console.log(error))
      setOpen(false);
    }
  }

  const handleExpDelete = (index) => {
    const updatedExp = expenseInput.filter((ele,i)=>index!==i)
    setExpenseInput(updatedExp)
  }



  return (
  <>
    <TableContainer component={Paper} className={container_with_scrolls}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="center">S.No</TableCell>
            <TableCell>Expenses</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            expenseInput.map((ele, index) => (
              <TableRow hover key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    label="Expense Name"
                    variant="outlined"
                    name="expensiveName"
                    value={ele.expensiveName}
                    onChange = {(e)=>handleExpenseChange(index,e)}
                    error = {errors[`[${index}].expensiveName`] !== undefined}
                  />
                  <label className={errorLabel}>{errors[`[${index}].expensiveName`]}</label>
                </TableCell>
                <TableCell>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    label="Total Amount"
                    variant="outlined"
                    name="expensiveCost"
                    value={ele.expensiveCost}
                    onChange = {(e)=>handleExpenseChange(index,e)}
                    error = {errors[`[${index}].expensiveCost`] !== undefined}
                  />
                  <label className={errorLabel}>{errors[`[${index}].expensiveCost`]}</label>
                </TableCell>
                <TableCell align="center" >
                 <IconButton onClick={()=>handleExpDelete(index)} disabled={index===0}><DeleteIcon/></IconButton>
                </TableCell>
              </TableRow >))
          }
        </TableBody>
      </Table>
    </TableContainer>
    <Container  maxWidth='xl' disableGutters className={TotalExpensesWrapper} >
      <Typography variant="h6" color="primary">Expenses: {expenseInput.length} & Total Amount: {total}</Typography>
      <Button variant="contained" color="primary" startIcon={<SaveIcon/>} align="center" onClick={handleSaveExpense}>
        Save
      </Button>
    </Container>
  </>
  );
};

export default ExpenseTable;
