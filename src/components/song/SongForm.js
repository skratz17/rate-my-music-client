import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';

import { api } from '../../api';
import { Button, FormControl, WarningText } from '../common';
import { ArtistAutocompleteSearchBar } from '../artist/ArtistAutocompleteSearchBar';

const songFormSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  artistId: yup.number('Artist is required.').typeError('Artist is required.').required('Artist is required.'),
  year: yup.number().typeError('Year must be a number.').required('Year is required.').integer('Year must be a whole number.').min(1850, 'Year must be on or after 1850.').max((new Date()).getFullYear(), 'Year must be on or earlier than the current year.'),
});

export const SongForm = props => {
  const { song } = props;

  const history = useHistory();

  const { register, handleSubmit, control, errors } = useForm({
    resolver: yupResolver(songFormSchema),
    defaultValues: {
      name: song?.name || '',
      artistId: song?.artistId || '',
      year: song?.year || ''
    }
  });

  const [ error, setError ] = useState('');

  const onSubmit = async songData => {
    try {
      const songResponse = await api.songs.create(songData);
      history.push(`/songs/${songResponse.id}`);
    }
    catch(e) {
      setError(e.message);
    }
  };

  return (
    <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit(onSubmit)} aria-labelledby="song-form-title">
      <h2 id="song-form-title"><span className="text-deepred">New</span> Song</h2>

      <WarningText>{error}</WarningText>

      <FormControl name="name"
        type="text"
        label="Name"
        register={register}
        error={errors.name?.message} />

      <FormControl name="artist"
        label="Artist"
        error={errors.artistId?.message}>
        <Controller
          name="artistId"
          control={control}
          render={props => (
            <ArtistAutocompleteSearchBar className="p-2"
              name="artist"
              onSelect={artist => props.onChange(artist?.id)}
            />
          )}
        />
      </FormControl>

      <FormControl name="year"
        type="text"
        label="Year"
        register={register}
        error={errors.year?.message} />

      <Button type="submit" className="ml-auto">Create Song</Button>
    </form>
  );
};