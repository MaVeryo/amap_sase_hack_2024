import { ReactElement } from "react";
import { useNavigate } from 'react-router-dom';

//TODO: have it go from userProfile to other pages. 
// async function userProfFunc(event: React.MouseEvent<HTMLButtonElement>, navigate: ReturnType<typeof useNavigate>){
//     event.preventDefault();
//     const input = {

//     }
// }

export default function UserProfile(): ReactElement {
    const navigate = useNavigate();
    return(
        <div>HELLO WORLD</div>
    )
}