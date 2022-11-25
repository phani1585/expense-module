import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  SwipeableDrawer,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  withStyles,
  Switch
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from '@material-ui/icons/Close';
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import StorageIcon from "@material-ui/icons/Storage";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { userContext } from "../App";
import ListAltIcon from '@material-ui/icons/ListAlt';


const useStyles = makeStyles(theme=>(
  {
    closeWrapper: {
      width: "100%",
      maxWidth: "360px",
    },
    leftCloseArrow: {
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
      marginLeft: "10px",
    },
    linkTag: {
      textDecoration: "none",
      display: "flex",
      color: theme.palette.text.primary,
    },
    flexBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    darkmode:{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap:'2px'
    },
  
  }
));


// this switch for dark theme
const IOSSwitch = withStyles((theme) => ({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#fff',
          opacity: 0.9,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#000',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `0px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });



const NavBar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {isDark,setIsDark}=useContext(userContext)

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar className={classes.flexBox}>
          <Box component="span" className={classes.flexBox}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">User's Expenses </Typography>
          </Box>
          <Box className={classes.darkmode}>
            <WbSunnyIcon onClick={()=>setIsDark(false)}/>
            <FormControlLabel
              control={<IOSSwitch inputProps={{margin:'0px'}} checked={isDark} onChange={()=>setIsDark((prev)=>!prev)} name="checkedB" />}//We have to include the fuctionality
            />
            <NightsStayIcon onClick={()=>setIsDark(true)}/>
          </Box>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={() => {}}
        onClose={() => setOpen(false)}
      >
        <Box className={classes.leftCloseArrow} p={2}>
          <IconButton disableRipple onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <div className={classes.closeWrapper}>
          <List component="nav" aria-label="main mailbox folders">
            <NavLink className={classes.linkTag} to="/" onClick={() => setOpen(false)}>
              <ListItem divider button>
                  <ListItemIcon>
                    <GroupAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create New User" />
              </ListItem>
            </NavLink>
            <NavLink className={classes.linkTag} to="/user_list" onClick={() => setOpen(false)}>
              <ListItem divider button>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary="User's List" />
              </ListItem>
            </NavLink>
            <NavLink className={classes.linkTag} to='/import_excel' onClick={() => setOpen(false)}>
              <ListItem divider button>
                <ListItemIcon>
                  <ListAltIcon/>
                </ListItemIcon>
                <ListItemText  primary="Import Excel File"/>
              </ListItem>
            </NavLink>
          </List>
        </div>
      </SwipeableDrawer>
    </Box>
  );
};

export default NavBar;
