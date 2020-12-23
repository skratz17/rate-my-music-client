import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';

import { api } from '../../api';
import { Button, RemoveButton, FormControl, WarningText } from '../common';
import { ArtistAutocompleteSearchBar } from '../artist/ArtistAutocompleteSearchBar';
import { GenreAutocompleteSelector } from '../genre/GenreAutocompleteSelector';

const SERVICES = [ 'SoundCloud', 'YouTube' ];

const songSourceSchema = yup.object().shape({
  service: yup.string()
    .required('Service is required.'),

  url: yup.string()
    .required('Song URL is required.')
    .url('Must be a valid URL.'),

  isPrimary: yup.bool()
    .required('Is primary is required.')
});

const songFormSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),

  artistId: yup.number('Artist is required.')
    .typeError('Artist is required.')
    .required('Artist is required.'),

  year: yup.number()
    .typeError('Year must be a number.')
    .required('Year is required.')
    .integer('Year must be a whole number.')
    .min(1850, 'Year must be on or after 1850.')
    .max((new Date()).getFullYear(), 'Year must be on or earlier than the current year.'),

  genreIds: yup.array()
    .of(yup.number())
    .min(1, 'You must select at least one genre.')
    .required('At least one genre is required.'),

  sources: yup.array()
    .of(songSourceSchema)
    .min(1, 'You must add at least one source.')
    .test(
      'has-one-primary-source', 
      'There must be one and only one primary source.', 
      value => value.filter(v => v.isPrimary).length === 1
    )
    .required('At least one source is required.')
});

export const SongForm = props => {
  const { song } = props;

  const history = useHistory();

  const { register, handleSubmit, watch, control, errors } = useForm({
    resolver: yupResolver(songFormSchema),
    defaultValues: {
      name: song?.name || '',
      artistId: song?.artist?.id|| '',
      year: song?.year || '',
      genreIds: song?.genres.map(g => g.id) || [],
      sources: song?.sources || [ { service: '', url: '', isPrimary: true } ]
    }
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'sources'
  });

  const sources = watch('sources');

  const [ error, setError ] = useState('');

  const onSubmit = async songData => {
    try {
      const songResponse = song ? await api.songs.update(song.id, songData) : await api.songs.create(songData);
      history.push(`/songs/${songResponse.id}`);
    }
    catch(e) {
      setError(e.message);
    }
  };

  return (
    <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit(onSubmit)} aria-labelledby="song-form-title">
      <h2 id="song-form-title" className="text-2xl text-center">
        { song ? 'Edit' : 'New' } <span className="text-deepred">Song</span>
      </h2>

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
              defaultValue={song?.artist}
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

      <FormControl name="genres"
        label="Genre(s)"
        error={errors.genreIds?.message}>
        <Controller
          name="genreIds"
          control={control}
          render={props => (
            <GenreAutocompleteSelector className="p-2"
              name="genres"
              defaultValue={song?.genres}
              onSelect={genres => props.onChange(genres.map(g => g.id))}
            />
          )}
        />
      </FormControl>

      <h3>Song Source(s)</h3>
      <WarningText>{errors.sources?.message}</WarningText>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id} className="my-2">
            <fieldset className="flex flex-col md:flex-row w-full p-2 border border-gray-200">
              <FormControl name={`sources[${index}].service`}
                className="md:mr-2 md:w-auto w-full"
                label="Service"
                error={errors.sources && errors.sources[index]?.service?.message}>
                  <select id={`sources[${index}].service`} 
                    name={`sources[${index}].service`} 
                    className="p-2"
                    defaultValue={item.service}
                    ref={register()}>
                      <option value="" disabled>Select a service...</option>
                      { SERVICES.map(service => <option key={service} value={service}>{service}</option>) }
                  </select>
              </FormControl>

              <FormControl name={`sources[${index}].url`}
                className="flex-grow md:mx-2 md:w-auto w-full"
                label="Song URL"
                error={errors.sources && errors.sources[index]?.url?.message}>
                  <input type="text"
                    name={`sources[${index}].url`}
                    id={`sources[${index}].url`}
                    className="p-2"
                    ref={register()}
                    defaultValue={item.url} />
              </FormControl>
              
              <FormControl name={`sources[${index}].isPrimary`}
                className="md:ml-2 md:items-center items-start justify-evenly md:w-auto w-full"
                label="Is Primary?"
                error={errors.sources && errors.sources[index]?.isPrimary?.message}>
                  <input type="checkbox" 
                    name={`sources[${index}].isPrimary`}
                    defaultChecked={item.isPrimary}
                    id={`sources[${index}].isPrimary`} 
                    ref={register()} />
              </FormControl>

              <RemoveButton className="order-first md:order-none self-end md:self-center md:mx-2"
                disabled={sources.length === 1}
                onClick={() => remove(index)}
                accessibleName={`Remove Song Source from ${item.service}`} />
            </fieldset>
          </li>
        ))}
      </ul>

      <Button type="button" onClick={() => append({ service: '', url: '', isPrimary: false })}>Add Additional Source</Button>

      <Button type="submit" className="ml-auto">{song ? 'Update' : 'Create' } Song</Button>
    </form>
  );
};