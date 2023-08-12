import React, { Fragment, useState } from 'react'
import {SpeedDial,SpeedDialAction } from "@material-ui/lab"
import "./Header.css"
import { Backdrop } from '@material-ui/core'
import DashboardIcon from "@material-ui/icons/Dashboard"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ListAltIcon from "@material-ui/icons/ListAlt"
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { logout } from '../../../actions/userAction'
import { useDispatch } from 'react-redux'
import zIndex from '@material-ui/core/styles/zIndex'

const UserOptions = ({user}) => {

  const alert = useAlert()
  const dispatch = useDispatch()

  const options = [
     {icon:<ListAltIcon />,name:"Orders",func:orders},
     {icon:<PersonIcon />,name:"profile",func:account},
     {icon:<ExitToAppIcon />, name:"Logout",func:logoutUser}

    ]
    const navigate = useNavigate()

    if(user.role === "admin")
    {
      options.unshift({icon:<DashboardIcon />,name:"Dashboard",func:dashboard},)
    }


    function dashboard() {
      navigate("/dashboard")
    }

    function orders() {
      navigate("/orders")
    }

    function account() {
      navigate("/account")
    }

    function logoutUser(){
      dispatch(logout())
      alert.success("Logout Successfully")
    }

  const [open,setOpen] = useState(false)

  return <Fragment>
    <Backdrop open={open} style={{ zIndex: 10 }} />

    <SpeedDial ariaLabel='SpeedDial tooltip example' className="speedDial" onClose={() => setOpen(false)} onOpen={() => setOpen(true)} icon={<img className='speedDialIcon' src="/profile.png" alt="profile"/>} open={open} direction='down'>
      {options.map((item) => (
    <SpeedDialAction icon={item.icon} tooltipTitle={item.name} onClick={item.func}/>
        
      ))}
    </SpeedDial>
    
  </Fragment>
}

export default UserOptions
