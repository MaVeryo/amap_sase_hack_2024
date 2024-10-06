import { ReactElement } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

//TODO: have it go from userProfile to other pages. 
// async function userProfFunc(event: React.MouseEvent<HTMLButtonElement>, navigate: ReturnType<typeof useNavigate>){
//     event.preventDefault();
//     const input = {

//     }
// }

//from dashboard
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

async function dashboardFunc(event: React.MouseEvent<HTMLButtonElement>, navigate: ReturnType<typeof useNavigate> ){
    event.preventDefault();

    //response checker? 

    navigate('/dashboard');
}


function UserProfile(): ReactElement {
    const navigate = useNavigate();
    const [ userData, setUserData ] = useState(null);
    const [editMode, setEditMode] = useState(false); // Toggle edit mode 
    
    const updateUserData = async (newData: { username: string; email: string }) => {
        try {
          // API call to update user profile
          const response = await fetch('/api/update-user-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
          });
      
          if (response.ok) {
            const updatedUser = await response.json(); // Assuming server returns updated user data
            console.log('Profile updated successfully:', updatedUser);
      
            // Update the frontend state with the new user data
            setUserData(updatedUser);
      
            // Optionally show a success message to the user
            alert('Profile updated successfully!');
          } else {
            // Handle any error responses from the server
            const errorData = await response.json();
            console.error('Failed to update profile:', errorData.message);
            alert(`Error: ${errorData.message}`);
          }
        } catch (error) {
          // Handle any network errors or unexpected failures
          console.error('Error while updating profile:', error);
          alert('Failed to update profile. Please try again.');
        }
      };
      
      //styling
      const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: 'bg-background',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        ...theme.applyStyles('dark', {
          backgroundColor: '#1A2027',
        }),
      }));

    useEffect(() => {
        getUserData().then(( data ) => setUserData(data));
    }, []);

    return(
        <div className="container mx-auto p-6 max-w-lg">
            
            {userData && (
                <>
                {/* @ts-ignore - username is always defined */}
                <h1 className="text-2xl font-bold mb-4">{userData.username}</h1>
                <button 
                id="toUser" 
                type="button" 
                className ="bg-background text-white p-3 rounded-md mt-3 absolute top-4 right-4 hover:bg-blue-400" 
                onClick={(e) => dashboardFunc(e, navigate)}>PFP
                </button>

                <Box sx={{ width: '100%', bgcolor: '#16151c'}}>
                    <Stack spacing={2}>
                        {/* <Item>{userData.password} </Item> */}
                        <Item>Item 2</Item>
                        <Item>Item 3</Item>
                    </Stack>
                </Box>

                
                </>
               
            )}
            
            
        </div>
       
  );
};

export default UserProfile;