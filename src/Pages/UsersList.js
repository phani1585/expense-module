import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,Backdrop, Grid, Typography, ButtonGroup, TextField
  } from "@material-ui/core";
  // import {Link} from 'react-router-dom'
  import React, { createContext, useContext,useState} from "react";
  import { userContext } from "../App";
  import DeleteIcon from "@material-ui/icons/Delete";
  // import EditIcon from '@material-ui/icons/Edit';
  import ExpensesModel from '../components/ExpensesModal';
  import { makeStyles, withStyles } from '@material-ui/core/styles';
  import axios from "axios";
  import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
  import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
  
  export const tableContext = createContext()
  
  
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      transition:'all 0.15s',
      cursor:'pointer',
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,    
      },
      '&:hover':{
        backgroundColor:'rgba(0,0,0,0.2)',
      }
    },
  }))(TableRow);
  
  const useStyles = makeStyles({
    tableWrapper: {
      marginTop:'20px',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
    },
    paginationWrapper:{
      display:'flex',
      flexDirection:'column',
      justifyContent:'flex-end',
      alignItems:'flex-end',
      marginBottom:'20px'
    }
  })
  
  const UsersList = () => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false);
    const [userObject,setUserObject] = React.useState({})
    const { users, handleDelete,getData } = useContext(userContext);//'handleEdit' add this function for edit feature in createUser form
    const [expenseInput,setExpenseInput] = useState([{expensiveName: '', expensiveCost: ''}])
    const [expense,setExpense] = useState([])
    const [isLoading,setIsLoading]=useState(false)
    const [page,setPage]=useState(1)
    const [toEdit,setToEdit]=useState({name: -1, email: -1, mobile: -1, password: -1, gender: -1})
    const [changedData,setChangeData]=useState('')
  
    //Api call for geting and the data from expenses
    const getExpData = (id) => {
      setIsLoading(true)
      const body = new FormData()
      body.append('id',id)
      body.append('expensives','')
      axios.post('http://192.168.15.111:5000/user/getAllUsers', body).then(response=>{console.log(response)    
      setIsLoading(false)
    })
    }
    
    const handleOpen = (ele) => {
      setOpen(true);
      setUserObject(ele)
      getExpData(ele.id)
    };
  
  
    const handleClose = () => {
      setOpen(false);
    };
  // these two for pagenation
    const handlePageCount = (value) => {
        setPage(prev=>prev+value) 
    }
    
    let totalPageCount = Math.ceil(users.length/9)
  // this function for dblClick Edit
  
    const  handleDblClickEdit = (e,i,eventName,initialValue) => {
      setChangeData(initialValue)
      setToEdit((prev)=>({...prev, [eventName]: i}))
    }

    const handleBlurOfTableCell = (e,i,eventName,selectedElement)=>{
      setToEdit((prev)=>({...prev, [eventName]: i}))
      const body = new FormData();
      body.append("name", eventName==='name'?changedData:'');
      body.append("email",eventName==='email'?changedData:'');
      body.append("mobile",eventName==='mobile'?changedData:'');
      body.append("password",'');
      body.append("confirmPassword",'');
      body.append("gender",eventName==='gender'?changedData:'');
      body.append("id", selectedElement.id)
      axios
      .post("http://192.168.15.111:5000/user/submitUser", body)
      .catch((error) => console.log(error,'form post data'));
      getData()
    };
    

    const handleChangeOfTableCell = (e) => {
      setChangeData(e.target.value)
    }
  
    return (
      <tableContext.Provider value={{getExpData,userObject,open,handleClose,expenseInput,setExpenseInput,expense,setExpense,setOpen}}>

        <Grid container className={classes.tableWrapper} >
        <Grid item xs={12} sm={10} md={10} lg={8} xl={8} className={classes.paginationWrapper}>
          <div>
          <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
             <Button startIcon={<ArrowBackIosIcon/>} disabled={page===1} onClick={()=>handlePageCount(-1)}>previous Page</Button>
             <Button endIcon={<ArrowForwardIosIcon/>} disabled={page===totalPageCount||totalPageCount===0} onClick={()=>handlePageCount(1)} >Next Page</Button>
          </ButtonGroup>
          </div>
            <Typography>Pages {page} of {totalPageCount}</Typography>
        
        </Grid>
          <Grid item xs={12} sm={10} md={10} lg={8} xl={8} >
            <TableContainer  component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile No.</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              {/* <StyledTableCell>Edit</StyledTableCell> */}
              <StyledTableCell>Delete</StyledTableCell>
              <StyledTableCell>Expenses</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((ele,index) => (index>=(9*(page-1)) && index<=(9*page)) && (
              <StyledTableRow key={ele.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>


                    <StyledTableCell onDoubleClick={(e)=>handleDblClickEdit(e,index,'name',ele.name)}
                     onBlur={(e)=>handleBlurOfTableCell(e,-1,'name',ele)}>
                      {toEdit['name'] === index ? <TextField autoFocus value={changedData} onChange={(e)=>handleChangeOfTableCell(e)}/>:ele.name}
                    </StyledTableCell>


                    <StyledTableCell onDoubleClick={(e)=>handleDblClickEdit(e,index,'email',ele.email)}
                     onBlur={(e)=>handleBlurOfTableCell(e,-1,'email',ele)} >
                      {toEdit['email'] === index ? <TextField autoFocus value={changedData} onChange={(e)=>handleChangeOfTableCell(e)}/>:ele.email}
                    </StyledTableCell>


                    <StyledTableCell onDoubleClick={(e)=>handleDblClickEdit(e,index,'mobile',ele.mobile)} 
                     onBlur={(e)=>handleBlurOfTableCell(e,-1,'mobile',ele)}>
                      {toEdit['mobile'] === index ? <TextField autoFocus value={changedData} onChange={(e)=>handleChangeOfTableCell(e)}/>:ele.mobile}
                    </StyledTableCell>


                    <StyledTableCell onDoubleClick={(e)=>handleDblClickEdit(e,index,'gender',ele.gender)}
                      onBlur={(e)=>handleBlurOfTableCell(e,-1,'gender',ele)}>
                      {toEdit['gender'] === index ? <TextField autoFocus value={changedData} onChange={(e)=>handleChangeOfTableCell(e)}/>:ele.gender}
                    </StyledTableCell>


                    {/* <StyledTableCell><Link  onClick={()=>handleEdit(ele.id)} to="/" ><EditIcon/></Link></StyledTableCell> */}
                    <StyledTableCell onClick={() => handleDelete(ele.id)}>
                      <DeleteIcon />
                    </StyledTableCell>
                    <StyledTableCell>
                        <Button color="primary" variant="outlined" onClick={()=>handleOpen(ele)}>ADD</Button>
                    </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
            </TableContainer>
          </Grid>
        </Grid>
    {isLoading ? <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
               </Backdrop>:<ExpensesModel/>}
    </tableContext.Provider>
    );
  };
  
  export default UsersList;
  