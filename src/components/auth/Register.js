import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '../../api';
import { UserContext } from '../user/UserProvider';
import { FormControl, WarningText, Button } from '../common'

const registerFormSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required.')
    .matches(/^[a-zA-Z0-9@\.+-_]+$/, 'Username may only contain letters, numbers, and @.+-_ characters.'),

  email: yup.string()
    .required('Email is required.')
    .email('Must be a valid email address.'),

  password: yup.string()
    .required('Password is required.'),

  passwordConfirmation: yup.string()
    .test('passwords-match', 'Passwords must match.', function(value) {
      return this.parent.password === value
    })
    .required('Confirm password is required.'),

  firstName: yup.string()
    .required('First name is required.'),

  lastName: yup.string()
    .required('Last name is required.'),

  bio: yup.string()
    .required('Bio is required.')
});

export const Register = () => {
  const [ registrationError, setRegistrationError ] = useState('');

  const history = useHistory();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerFormSchema)
  });

  const { setUserToken } = useContext(UserContext);

  const onSubmit = async registrationInfo => {
    try {
      const { token } = await api.auth.register(registrationInfo);
      setUserToken(token);
      history.push('/home');
    }
    catch(e) {
      setRegistrationError(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="overflow-scroll bg-gray-50 bg-opacity-90 rounded shadow p-8 pb-2 max-w-md text-xl" style={{ maxHeight: '65%' }}>
      <h2 className="text-3xl text-center m-5 mt-0">Register a New Account</h2>

      <WarningText>{registrationError}</WarningText>

      <FormControl name="username"
        type="text"
        label="Username"
        register={register}
        error={errors.username?.message} />

      <FormControl name="email"
        type="text"
        label="Email"
        register={register}
        error={errors.email?.message} />

      <FormControl name="password"
        label="Password"
        type="password"
        register={register}
        error={errors.password?.message} />

      <FormControl name="passwordConfirmation"
        label="Confirm Password"
        type="password"
        register={register}
        error={errors.passwordConfirmation?.message} />

      <FormControl name="firstName"
        type="text"
        label="First Name"
        register={register}
        error={errors.firstName?.message} />

      <FormControl name="lastName"
        type="text"
        label="Last Name"
        register={register}
        error={errors.lastName?.message} />

      <FormControl name="bio"
        type="textarea"
        label="Bio"
        register={register}
        error={errors.bio?.message} />

      <Button className="ml-auto" type="submit">Register</Button>

      <div className="text-sm text-center pb-2">
        Already got an account? <Link to="/login">Go login!</Link>
      </div>
    </form>
  );
};