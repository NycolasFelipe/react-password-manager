import { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/showpasswords').then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = () => {
    Axios.post('http://localhost:3001/addpassword', {
      title: title,
      password: password,
    });
  };

  const decryptPassword = (encryption) => {
    Axios.post('http://localhost:3001/decryptpassword', {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((value) => {
          return value.id === encryption.id
            ? {
                id: value.id,
                title: response.data,
                password: value.password,
                iv: value.iv,
              }
            : value;
        })
      );
    });
  };

  return (
    <div className='App'>
      <h1 className='title'>Password Manager</h1>
      <div className='adding-password'>
        <input
          type='text'
          name='password'
          id='password'
          placeholder='Ex.: password123'
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type='text'
          name='title'
          id='title'
          placeholder='Ex.: Facebook'
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addPassword}>Add Password</button>
      </div>
      <div className='passwords'>
        {passwordList.map((value, key) => {
          return (
            <div
              className='password'
              onClick={() => {
                decryptPassword({
                  password: value.password,
                  iv: value.iv,
                  id: value.id,
                });
              }}
              key={key}
            >
              <h3>{value.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
