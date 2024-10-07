import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import FileUpload from '../components/fileupload';

async function getUserData() {
    const response = await fetch('/user-data', {
        method: 'GET',
    });
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Failed to get user data');
    }
}

export default function Profile() {
    const [ userData, setUserData ] = useState(null);

    useEffect(() => {
        getUserData().then(( data ) => setUserData(data));
    }, []);


    return (
        <>
        {userData && (
        <div className="grid w-screen h-screen grid-cols-3 gap-4 pl-[5rem] overflow-hidden">
          {/* User Info Card */}
          <Card className="col-span-1 row-span-1 w-full h-[220px]" sx={{ backgroundColor: "black" }}>
            <CardContent>
              <Typography sx={{ color: 'white', fontSize: 30 }}>
                {/* @ts-ignore - username is always defined */}
                Hello, {userData.username}
              </Typography>
              <br/>
              <Typography sx={{ color: 'white', fontSize: 18, paddingBottom: 1 }}>
                Contact Information
              </Typography>
              <Typography sx={{ color: 'white', fontSize: 14 }}>
                {/* @ts-ignore - phone is always defined */}
                Email: {userData.email}
              </Typography>
              <Typography sx={{ color: 'white', fontSize: 14 }}>
                {/* @ts-ignore - email is always defined */}
                Phone: {userData.phone}
              </Typography>
            </CardContent>
          </Card>
      
          {/* Resume Card */}
          <Card className="col-span-2 row-span-1 w-[90%] h-[100px] flex justify-between items-start" sx={{ backgroundColor: "black" }}>
            <CardContent className="flex flex-col justify-start">
              <Typography sx={{ color: 'white', fontSize: 30 }}>
                Resume
              </Typography>
              <Typography sx={{ color: 'white', fontSize: 16, paddingLeft: "2rem" }}>
                <FileUpload/>
              </Typography>
            </CardContent>
           
          
          </Card>
      
          {/* Links Card */}
          <Card className="col-span-1 row-span-1 w-full h-[300px]" sx={{ backgroundColor: "black" }}>
            <CardContent>
              <Typography sx={{ color: 'white', fontSize: 30 }}>
                Useful Contact
              </Typography>
              <br/>
              
              <Typography sx={{ color: 'white', fontSize: 14, padding:'15px' }}>
                <LinkedInIcon sx={{color: 'white', width:'30px', height:'30px'}}/>
                {/* @ts-ignore - linkedin is always defined */}
                <a href={userData.linkedin} style={{ color: 'white' }}>{userData.linkedin}</a>
              </Typography>

              <Typography sx={{ color: 'white', fontSize: 14, padding:'15px' }}>
                <PersonIcon sx={{color: 'white', width:'30px', height:'30px'}}/>
                 {/* @ts-ignore - linkedin is always defined */}
                <a href={userData.portfolio} style={{ color: 'white' }}>{userData.portfolio}</a>
              </Typography>
            </CardContent>
          </Card>
      
          <Card className="col-span-2 row-span-2 w-[90%] h-[400px]" sx={{ backgroundColor: "black" }}>
            <CardContent>
              <Typography sx={{ color: 'white', fontSize: 30, paddingBottom:3}}>
                Work/Project Experience
              </Typography>
              <Typography sx={{ color: 'white', fontSize: 20, paddingBottom:2}}>
                {/* @ts-ignore - linkedin is always defined */}
                {userData.experience}
              </Typography>

              <Typography sx={{ color: 'gray', fontSize: 15, paddingBottom:2}}>
                {/* @ts-ignore - linkedin is always defined */}
                {userData.experience}:<br/> {userData.experience}
              </Typography>
            </CardContent>
          </Card>
        </div>
        )}
        </>
      );      
}