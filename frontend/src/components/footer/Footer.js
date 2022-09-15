import { 
    CopyRightIcon,
    FaceBookIcon, 
    GithubIcon, 
    GoogleIcon, 
    InstagramIcon, 
    LinkedInIcon, 
    TwitterIcon 
    } from '../icons/SvgIcons';

const Footer = () => {
    const date = new Date();
    const socialIcons = [
        <GoogleIcon />,
        <LinkedInIcon />,
        <FaceBookIcon />,
        <TwitterIcon />,
        <GithubIcon />,
        <InstagramIcon />,
    ]


  return (
    <footer className="arbitrary text-center  text-white">
        <div className="container px-6 pt-6">
            <div className="flex justify-center space-x-6">
                {socialIcons?.map((social, index) => {
                    return (
                        <a key= {index} href="#!" type="button" className="rounded-full border-2 leading-normal uppercase hover:bg-blue-100 focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-9 h-9 m-1">
                            {social} 
                        </a>
                    )
                })}
            </div>
        </div>

        <div className="justify-center mt-8 p-4 flex " style={{color:"rgb(143, 189, 142) ",backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
        <CopyRightIcon />{date.getUTCFullYear()}
            <a href="https://simonjnr.netlify.app/" className="mx-5"> Simon</a>
        </div>
    </footer>
  )
}

export default Footer