import React, { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

async function loginFunc(event: React.MouseEvent<HTMLButtonElement>, navigate: ReturnType<typeof useNavigate>) {
  event.preventDefault();
  const input = {
    user: document.getElementById('username') as HTMLInputElement | null,
    pass: document.getElementById('password') as HTMLInputElement | null
  };
  if (input.user && input.pass) {
    const json = { user: input.user.value, pass: input.pass.value },
      body = JSON.stringify(json);

    console.log("test:", body);

    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    console.log(response.status);
    if (response.status === 200) {
      alert("Login Successful");
      navigate('/dashboard');
    } else {
      alert("Login failed");
    }
  }
}

const newLogin = async function (event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const input = {
        user: document.getElementById('username') as HTMLInputElement | null,
        pass: document.getElementById('password') as HTMLInputElement | null,
        email: document.getElementById('email') as HTMLInputElement | null,
        phone: document.getElementById('phone') as HTMLInputElement | null,
        linkedin: document.getElementById('linkedin') as HTMLInputElement | null,
        portfolio: document.getElementById('portfolio') as HTMLInputElement | null,
    };
    if (input.user && input.pass) {
        const json = {
            user: input.user.value,
            pass: input.pass.value,
            email: input.email ? input.email.value : '',
            phone: input.phone ? input.phone.value : '',
            linkedin: input.linkedin ? input.linkedin.value : '',
            portfolio: input.portfolio ? input.portfolio.value : ''
        },
            body = JSON.stringify(json);

        const response = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body
        });

        if (response.status === 200) {
            alert("New Login Created");
        } else {
            alert("No New Login Created");
        }
    }
}

export default function Login(): ReactElement {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex flex-col container mx-auto p-6">
      <form className="h-full">
        <h1 className="is-size-10 text-3xl font-sans mb-4">Login</h1>
        <div className="mb-3">
          <p className="relative">
            <input id="username" className="input p-3 rounded-md w-full" type="text" name="username" placeholder="Username" />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-envelope"></i>
            </span>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-check"></i>
            </span>
          </p>
        </div>
        <div className="mb-3">
          <p className="relative">
            <input className="input p-3 rounded-md w-full" id="password" type="password" name="password" placeholder="Password" />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-lock"></i>
            </span>
          </p>
        </div>

        <button id="login" type="button" className="bg-gray-800 text-white p-3 rounded-md mt-3 w-full hover:bg-blue-400" onClick={(e) => loginFunc(e, navigate)}>Login</button>
        <button id="newLogin" type="button" className="bg-gray-800 text-white p-3 rounded-md mt-3 w-full hover:bg-blue-400" onClick={handleOpen}>Create Account</button>
      </form>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="h-full">
            <h1 className="is-size-10 text-3xl font-sans mb-4">Create Account</h1>
            {/* Users Username */}
            <div className="mb-3">
          <p className="relative">
            <input id="username" className="input p-3 rounded-md w-full" type="text" name="username" placeholder="Username" />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-envelope"></i>
            </span>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-check"></i>
            </span>
          </p>
        </div>
        {/* Users Password */}
        <div className="mb-3">
          <p className="relative">
            <input className="input p-3 rounded-md w-full" id="password" type="password" name="password" placeholder="Password" />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-lock"></i>
            </span>
          </p>
        </div>

            {/* Users Email */}
            <div className="mb-3">
              <p className="relative">
                <input id="email" className="input p-3 rounded-md w-full" type="text" name="email" placeholder="Email" />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-envelope"></i>
                </span>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-check"></i>
                </span>
              </p>
            </div>
            {/* Users Phone */}
            <div className="mb-3">
              <p className="relative">
                <input className="input p-3 rounded-md w-full" id="phone" type="phone" name="phone" placeholder="Phone #" />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-check"></i>
                </span>
              </p>
            </div>
            {/* Users LinkedIn */}
            <div className="mb-3">
              <p className="relative">
                <input className="input p-3 rounded-md w-full" id="linkedin" type="text" name="linkedin" placeholder="linkedin url" />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-check"></i>
                </span>
              </p>
            </div>
            {/* Users Portfolio */}
            <div className="mb-3">
              <p className="relative">
                <input className="input p-3 rounded-md w-full" id="portfolio" type="text" name="portfolio" placeholder="portfolio" />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-check"></i>
                </span>
              </p>
            </div>
            <button id="newLogin" type="button" className="bg-gray-800 text-white p-3 rounded-md mt-3 w-full hover:bg-blue-400" onClick={newLogin}>Create Account</button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}