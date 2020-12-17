import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '../../api';

const loginFormSchema = yup.object().shape({
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.')
});

export const Login = () => {
  const { handleSubmit, register, errors } = useForm({
    resolver: yupResolver(loginFormSchema)
  });

  const [ loginError, setLoginError ] = useState('');

  const history = useHistory();

  const onSubmit = async loginData => {
    try {
      const { token } = await api.auth.login(loginData);
      localStorage.setItem('rmm_user', token);
      history.push('/home');
    }
    catch(e) {
      setLoginError('The credentials provided did not match an existing user.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Log In To Your Account</h2>

      { loginError && <p>{loginError}</p> }

      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="username" ref={register} />
      <p>{errors.username?.message}</p>

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" ref={register} />
      <p>{errors.password?.message}</p>

      <button type="submit">Log In</button>
    </form>
  );
};