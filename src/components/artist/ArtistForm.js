import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from '../../api';
import { Button, FormControl } from '../common';

const artistFormSchema = yup.object().shape({
  name: yup.string().required('Artist name is required.'),
  foundedYear: yup.number().typeError('Founded year must be a number.').required('Founded year is required.').integer('Founded year must be a whole number.').min(1850, 'Year must be on or after 1850.').max((new Date()).getFullYear(), 'Year must be on or earlier than the current year.'),
  description: yup.string().required('Description is required.')
});

export const ArtistForm = props => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(artistFormSchema)
  });

  const onSubmit = async artistData => {
    console.log(artistData);
  };

  return (
    <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <h2>New <span className="text-deepred">Artist</span></h2>

      <FormControl name="name"
        label="Name"
        register={register}
        error={errors.name?.message} />

      <FormControl name="foundedYear"
        label="Year Founded"
        register={register}
        error={errors.foundedYear?.message} />

      <FormControl name="description"
        type="textarea"
        label="Description"
        register={register}
        error={errors.description?.message} />

      <Button type="submit">Create Artist</Button>
    </form>
  );
};