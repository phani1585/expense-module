import { Button, Container, Grid, makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExcelTable from '../components/ExcelTable'
import * as XLSX from 'xlsx' 

const useStyles = makeStyles(theme=>({
   main_wrapper:{
      marginTop:theme.spacing(2),
      gap:theme.spacing(2)
   },
   container_of_import:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
   },  
   root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
    excel_table_wrapper:{
      backgroundColor:theme.palette.background.default,
    }

}))

const ReadExcel = () => {
   const {root,input,container_of_import,main_wrapper,excel_table_wrapper}=useStyles()

   const [data,setData]=useState([])

   const readExcelFile = (excelFile) => {
      const fileReadPromise = new Promise((resolve,reject)=>{

         const fileReader = new FileReader()

         fileReader.readAsArrayBuffer(excelFile)

         fileReader.onload=(e)=>{
            const bufferArray = e.target.result
         
            const wb = XLSX.read(bufferArray,{type:'buffer'})

            const wsname = wb.SheetNames[0]// getting only sheet names

            const ws = wb.Sheets[wsname]

            const data = XLSX.utils.sheet_to_json(ws)

            resolve(data)

         }

         fileReader.onerror=(error=>{
            reject(error)
         })

      })

      fileReadPromise.then(response=>setData(response)).catch(error=>console.log(error))
   }

  return (
    <Grid container className={main_wrapper} direction='column'>
        <Grid item container >
            <Grid item md={2} lg={2} xl={2}/>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
               <Container maxWidth='sm' className={container_of_import}>
                  <Typography variant='h6'>Uplaod the Excel File Here:</Typography>
               <div className={root}>
                  <input
                  className={input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={(e)=>{
                     let excelFile = e.target.files[0]
                     readExcelFile(excelFile)
                  }}
                  />
                  <label htmlFor="contained-button-file">
                  <Button startIcon={<CloudUploadIcon/>} variant="contained" color="primary" component="span" onClick={()=>{}}>
                     Upload
                  </Button>
                  </label>
               </div>
               </Container>
            </Grid>
            <Grid item md={2} lg={2} xl={2}/>   
        </Grid>
        <Grid item container> 
        <Grid item md={2} lg={2} xl={2}/>
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8} className={excel_table_wrapper}>
            <ExcelTable data={data}/>
        </Grid>
        <Grid item md={2} lg={2} xl={2}/>
         </Grid>
    </Grid>
  )
}

export default ReadExcel
