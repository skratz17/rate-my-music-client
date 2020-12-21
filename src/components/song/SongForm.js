import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from '../../api';
import { Button, FormControl, WarningText } from '../common';
import { ArtistAutocompleteSearchBar } from '../artist/ArtistAutocompleteSearchBar';

const songFormSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  artistId: yup.number('Artist is required.').typeError('Artist is required.').required('Artist is required.')
});

export const SongForm = props => {
  const { song } = props;

  const { register, handleSubmit, control, errors } = useForm({
    resolver: yupResolver(songFormSchema),
    defaultValues: {
      name: song?.name || '',
      artistId: song?.artistId || ''
    }
  });

  const [ error, setError ] = useState('');

  const onSubmit = songData => {
    console.log(songData);
  }

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

      <Button type="submit" className="ml-auto">Create Song</Button>
    </form>
  );
};