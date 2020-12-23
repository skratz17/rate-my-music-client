import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';

import { api } from '../../api';
import { Button, FormControl, WarningText, RemoveButton } from '../common';
import { SongAutocompleteSearchBar } from '../song/SongAutocompleteSearchBar';

const listSongSchema = yup.object().shape({
  songId: yup.number()
    .typeError('Song is required.')
    .required('Song is required.'),

  description: yup.string()
    .required('Song description is required.')
});

const listFormSchema = yup.object().shape({
  name: yup.string()
    .required('List name is required.'),

  description: yup.string()
    .required('List description is required.'),

  songs: yup.array()
    .of(listSongSchema)
    .min(1, 'You must add at least one song.')
    .test(
      'has-no-duplicate-songs',
      'Each song in the list must be unique.',
      value => {
        const uniqueIds = new Set(value.map(v => v.songId));
        return value.length === uniqueIds.size;
      }
    )
});

export const ListForm = props => {
  const { list } = props;

  const { register, handleSubmit, watch, control, errors } = useForm({
    resolver: yupResolver(listFormSchema),
    defaultValues: {
      name: list?.name || '',
      description: list?.description || '',
      songs: list?.songs || [ { songId: '', description: '' } ]
    }
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'songs'
  });

  const history = useHistory();

  const [ error, setError ] = useState('');

  const onSubmit = async listData => {
    // react hook form reserves use of `id` key in field array but this property is required for my api
    // convert `songId` property name of all songs to `id`
    const listDataToPost = { ...listData };
    listDataToPost.songs = listDataToPost.songs.map(s => ({ id: s.songId, description: s.description }));

    try {
      const listResponse = list ? await api.lists.update(list.id, listDataToPost) : await api.lists.create(listDataToPost);
      history.push(`/lists/${listResponse.id}`);
    }
    catch(e) {
      setError(e.message);
    }
  };

  const songs = watch('songs');

  return (
    <form className="max-w-screen-lg mx-auto" 
      aria-labelledby="list-form-title"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 id="list-form-title" className="text-2xl text-center">
        { list ? 'Edit' : 'New' } <span className="text-deepred">List</span>
      </h2>

      <WarningText>{error}</WarningText>

      <FormControl name="name"
        type="text"
        label="Name"
        register={register}
        error={errors.name?.message} />

      <FormControl name="description"
        type="textarea"
        label="Description"
        register={register}
        error={errors.description?.message} />

      <h3>Songs</h3>
      <WarningText>{errors.songs?.message}</WarningText>
      <ul>
        { fields.map((item, index) => (
          <li key={item.id}>
            <fieldset className="flex flex-col w-full p-2 my-2 border border-gray-200">
              <div className="flex">
                <RemoveButton className="mr-4"
                    disabled={songs.length === 1}
                    onClick={() => remove(index)}
                    accessibleName={`Remove ${item.name || 'song'} from list`} />
                <h4 className="text-xl">{index + 1}.</h4>
              </div>

              <FormControl name={`song-${index}`}
                label="Song"
                error={errors.songs && errors.songs[index]?.songId?.message}>
                <Controller name={`songs[${index}].songId`}
                  control={control}
                  defaultValue={item.songId}
                  render={props => (
                    <SongAutocompleteSearchBar className="p-2"
                      name={`song-${index}`}
                      defaultValue={list?.songs && list?.songs[index]}
                      onSelect={song => props.onChange(song?.id)}  
                    />
                  )}
                />
              </FormControl>

              <FormControl name={`songs[${index}].description`}
                label="Song Description"
                error={errors.songs && errors.songs[index]?.description?.message}>
                  <textarea name={`songs[${index}].description`} 
                    id={`songs[${index}].description`}
                    className="p-2"
                    ref={register()}
                    defaultValue={item.description} />
              </FormControl>
            </fieldset>
          </li>
        ))}
      </ul>

      <Button type="button" onClick={() => append({ songId: '', description: '' })}>Add Another Song</Button>

      <Button type="submit" className="ml-auto">
        { list ? 'Update' : 'Create' } List
      </Button>
    </form>
  );
};