import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const registerFormSchema = yup.object().shape({
  username: yup.string().required('Username is required.'),
  email: yup.string().email('Must be a valid email address.').required('Email is required.'),
  password: yup.string().required('Password is required.'),
  passwordConfirmation: yup.string().test('passwords-match', 'Passwords must match.', function(value) {
    return this.parent.password === value
  }).required('Confirm password is required.'),
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  bio: yup.string().required('Bio is required.')
});

export const Register = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(registerFormSchema)
  });

  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register a New Account</h2>

      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="username" ref={register} />
      <p>{errors.username?.message}</p>

      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" ref={register} />
      <p>{errors.email?.message}</p>

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" ref={register} />
      <p>{errors.password?.message}</p>

      <label htmlFor="passwordConfirmation">Confirm Password</label>
      <input type="password" name="passwordConfirmation" id="passwordConfirmation" ref={register} />
      <p>{errors.passwordConfirmation?.message}</p>

      <label htmlFor="firstName">First Name</label>
      <input type="text" name="firstName" id="firstName" ref={register} />
      <p>{errors.firstName?.message}</p>

      <label htmlFor="lastName">Last Name</label>
      <input type="text" name="lastName" id="lastName" ref={register} />
      <p>{errors.lastName?.message}</p>

      <label htmlFor="bio">Bio</label>
      <textarea name="bio" id="bio" ref={register} />
      <p>{errors.bio?.message}</p>

      <button type="submit">Register</button>
    </form>
  );
};