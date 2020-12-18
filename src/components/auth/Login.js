import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '../../api';
import { FormControl } from '../common/FormControl';
import { WarningText } from '../common/WarningText';

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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 bg-opacity-90 rounded shadow p-5 pb-2 max-w-md text-xl">
      <h2 className="text-3xl text-center m-5 mt-0">Log In To Your Account</h2>

      <WarningText>{loginError}</WarningText>

      <FormControl name="username"
        label="Username"
        register={register}
        error={errors.username?.message} />

      <FormControl name="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password?.message} />

      <button className="bg-lightblue hover:bg-lightblue-dark p-2 rounded-sm block ml-auto" type="submit">Log In</button>

      <div className="text-sm text-center">
        New here? <Link to="/register">Sign up for an account.</Link>
      </div>
    </form>
  );
};