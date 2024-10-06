import { ReactElement } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

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

type UserProfileProps = {
    userData: { username: string; email: string };
    updateUserData: (newData: { username: string; email: string }) => void;
};

function UserProfile(): ReactElement {
    const navigate = useNavigate();
    const [ userData, setUserData ] = useState(null);
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    {/* @ts-ignore - username is always defined */}
    const [formData, setFormData] = useState({ username: userData.username, email: userData.email });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateUserData(formData);
        setEditMode(false);
    };
    
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
    

    useEffect(() => {
        getUserData().then(( data ) => setUserData(data));
    }, []);

    return(
         <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      
      {/* User Info */}
      <div className="bg-background p-4 rounded-md shadow-md">
        {!editMode ? (
          <>
            {/* @ts-ignore - username is always defined */}
            <p className="text-lg"><strong>Username:</strong> {userData.username}</p>
            {/* @ts-ignore - username is always defined */}
            <p className="text-lg"><strong>Email:</strong> {userData.email}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;