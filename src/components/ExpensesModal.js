import React, { useContext } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import ExpenseTable from './ExpenseTable';
import {tableContext} from '../Pages/UsersList'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
  expensesWrapper:{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',color:'white'}
})

export default function TransitionsModal() {
  const {expensesWrapper} = useStyles()

  const {open,handleClose,userObject,setExpenseInput}=useContext(tableContext)
    

  const addNewExpense = () => {
    setExpenseInput((prev)=>([...prev,{expensiveName: '', expensiveCost: ''}]))
  }
  


  return (
    <div>
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle style={{backgroundColor:'#3f51b5'}}>
        <div className={expensesWrapper}>
        <Typography variant='h6'color='inherit'>Expenses of {userObject.name}</Typography>
        <Button color='inherit' variant='outlined'onClick={addNewExpense}>Add Expenses</Button>
        </div>
      </DialogTitle>
      <ExpenseTable/>
    </Dialog>
    </div>
  );
}