import {useState} from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
  } from "@material-tailwind/react";
import { NotificationsIcon, UserProfileIcon } from "../icons/SvgIcons";
import Toast from "../toast/Toast";
import { LogOutIcon } from "./../icons/SvgIcons";


const ProfileCard = ({ currentuser}) => {
  const [showToast, setShowToast] = useState(false)
  return (
    <Card className="w-80 h-60 divide-y divide-line" >
      <CardHeader className="h-20 justify-center flex w-30 p-0 m-0 ">
        <img className="w-20 h-20 rounded-full" src={currentuser?.profileImg}  alt = "user"/>
      </CardHeader>
      <CardBody className="text-center h-50">
        <Typography variant="h4" color="" className="mb-2 text-teal-700">
          {currentuser?.userName}
        </Typography>
        <Typography color="blue" className="font-medium text-teal-700" >
          Software Engineer
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2">
        <Tooltip content="Notifications">
          <Typography
            as="a"
            href="#notifications"
            variant="lead"
            color="blue"
            textGradient
          >
            {<NotificationsIcon />}
          </Typography>
        </Tooltip>
        <Tooltip content="Logout">
          <Typography
            as="a"
            href="#logout"
            variant="lead"
            color="blue"
            textGradient
          >
            {<LogOutIcon />}
          </Typography>
        </Tooltip>
        <Tooltip content="Profile">
          <Typography
            as="a"
            href="#notifications"
            variant="lead"
            color="blue"
            textGradient
          >
            {<UserProfileIcon />}
          </Typography>
        </Tooltip>
      </CardFooter>
      {showToast && <Toast />}
      
    </Card>
  )
}

export default ProfileCard