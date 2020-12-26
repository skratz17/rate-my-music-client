import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { SongForm } from './SongForm';
import { api } from '../../api';

jest.mock('../../api');
const mockPostSong = (api.songs.create = jest.fn());
const mockUpdateSong = (api.songs.update = jest.fn());
const mockSearchArtists = (api.artists.search = jest.fn());
const mockSearchGenres = (api.genres.search = jest.fn());

describe('song form validation', () => {
  test('all fields are required, and is primary checkbox defaults to true', async () => {
    render(<SongForm />);

    await waitFor(() => userEvent.click(screen.getByText('Create Song')));

    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(await screen.findByText('Artist is required.')).toBeInTheDocument();
    expect(await screen.findByText('Year must be a number.')).toBeInTheDocument();
    expect(await screen.findByText('You must select at least one genre.')).toBeInTheDocument();
    expect(await screen.findByText('Service is required.')).toBeInTheDocument();
    expect(await screen.findByText('Song URL is required.')).toBeInTheDocument();
    expect(screen.getByLabelText('Is Primary?')).toBeChecked();
  });

  test('year must be >= 1850', async () => {
    render(<SongForm />);

    await waitFor(() => userEvent.type(screen.getByLabelText('Year'), '1849'));
    await waitFor(() => userEvent.click(screen.getByText('Create Song')));

    expect(await screen.findByText('Year must be on or after 1850.')).toBeInTheDocument();
  });

  test('year must be <= current year', async () => {
    render(<SongForm />);

    const currentYear = (new Date()).getFullYear();
    await waitFor(() => userEvent.type(screen.getByLabelText('Year'), String(currentYear + 1)));
    await waitFor(() => userEvent.click(screen.getByText('Create Song')));

    expect(await screen.findByText('Year must be on or earlier than the current year.')).toBeInTheDocument();
  });

  test('song source url must be a valid url', async () => {
    render(<SongForm />);

    await waitFor(() => userEvent.type(screen.getByLabelText('Song URL'), 'test'));
    await waitFor(() => userEvent.click(screen.getByText('Create Song')));

    expect(await screen.findByText('Must be a valid URL.')).toBeInTheDocument();
  });

  test('there must be at least one primary source', async () => {
    render(<SongForm />);

    await waitFor(() => userEvent.click(screen.getByLabelText('Is Primary?')));
    await waitFor(() => userEvent.click(screen.getByText('Create Song')));

    expect(await screen.findByText('There must be one and only one primary source.')).toBeInTheDocument();
  });

  test('there must be no more than one primary source', async () => {
    render(<SongForm />);

    await waitFor(() => userEvent.click(screen.getByText('Add Additional Source')));

    const isPrimaryCheckboxes = await screen.findAllByLabelText('Is Primary?');
    expect(isPrimaryCheckboxes).toHaveLength(2);

    await waitFor(() => userEvent.click(isPrimaryCheckboxes[1]));

    expect(isPrimaryCheckboxes[0]).toBeChecked();
    expect(isPrimaryCheckboxes[1]).toBeChecked();

    await waitFor(() => userEvent.click(screen.getByText('Create Song')));

    expect(await screen.findByText('There must be one and only one primary source.')).toBeInTheDocument();
  });
});

describe('song form functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  const renderComponent = ui => {
    const history = createMemoryHistory();

    render(<Router history={history}>{ui}</Router>);

    return history;
  };

  test('calls song create method with song data on submit and redirects to song detail page', async () => {
    const history = renderComponent(<SongForm />);

    mockSearchArtists.mockResolvedValue({
      count: 1,
      data: [ { id: 1, name: 'The Magnetic Fields' } ]
    });
    mockSearchGenres.mockResolvedValueOnce({
      count: 2,
      data: [ { id: 1, name: 'indie pop' }, { id: 2, name: 'indie folk' } ]
    });
    mockPostSong.mockResolvedValueOnce({ id: 1 });
    
    await waitFor(() => userEvent.type(screen.getByLabelText('Name'), 'Save a Secret for the Moon'));
    await waitFor(() => userEvent.type(screen.getByLabelText('Artist'), 'Mag'));
    await waitFor(() => jest.advanceTimersByTime(500));

    expect(await screen.findByText('The Magnetic Fields')).toBeInTheDocument();
    await waitFor(() => userEvent.click(screen.getByText('The Magnetic Fields')));

    await waitFor(() => userEvent.type(screen.getByLabelText('Year'), '1996'));

    await waitFor(() => userEvent.type(screen.getByLabelText('Genre(s)'), 'ind'));
    await waitFor(() => jest.advanceTimersByTime(500));

    expect(await screen.findByText('indie pop')).toBeInTheDocument();
    expect(await screen.findByText('indie folk')).toBeInTheDocument();
    await waitFor(() => userEvent.click(screen.getByText('indie pop')));

    await waitFor(() => userEvent.selectOptions(screen.getByLabelText('Service'), 'YouTube'));
    await waitFor(() => userEvent.type(screen.getByLabelText('Song URL'), 'https://www.youtube.com/watch?v=4rk_9cYOp8A'));

    await waitFor(() => userEvent.click(screen.getByText('Add Additional Source')));
    await waitFor(() => userEvent.selectOptions(screen.getAllByLabelText('Service')[1], 'SoundCloud'));
    await waitFor(() => userEvent.type(screen.getAllByLabelText('Song URL')[1], 'https://soundcloud.com/themagneticfields/save-a-secret-for-the-moon-1'));

    await waitFor(() => userEvent.click(screen.getByText('Create Song')));

    expect(mockPostSong).toHaveBeenCalledTimes(1);
    expect(mockPostSong).toHaveBeenCalledWith({
      name: 'Save a Secret for the Moon',
      artistId: 1,
      year: 1996,
      genreIds: [ 1 ],
      sources: [
        { service: 'YouTube', url: 'https://www.youtube.com/watch?v=4rk_9cYOp8A', isPrimary: true },
        { service: 'SoundCloud', url: 'https://soundcloud.com/themagneticfields/save-a-secret-for-the-moon-1', isPrimary: false }
      ]
    });

    await waitFor(() => expect(history.location.pathname).toEqual('/songs/1'));
  });

  test('prepopulates form with song data if song passed as prop and calls update method on submit', async () => {
    mockUpdateSong.mockImplementationOnce((id, song) => Promise.resolve({ id }));

    const songData = {
      id: 12,
      name: 'Ambulance Blues',
      artist: { id: 2, name: 'Neil Young' },
      year: 1973,
      genres: [ { id: 1, name: 'Folk' }, { id: 2, name: 'Classic Rock' }],
      sources: [ { service: 'YouTube', url: 'https://www.youtube.com/watch?v=EA2BNB_4m3g', isPrimary: true } ]
    };

    const history = renderComponent(<SongForm song={songData} />);

    await waitFor(() => expect(screen.getByLabelText('Name')).toEqual(screen.getByDisplayValue('Ambulance Blues')));
    expect(screen.getByText('Neil Young')).toBeInTheDocument();
    expect(screen.getByText('Clear Artist')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toEqual(screen.getByDisplayValue('1973'));
    expect(screen.getByText('Remove Folk')).toBeInTheDocument();
    expect(screen.getByText('Remove Classic Rock')).toBeInTheDocument();
    expect(screen.getByLabelText('Service')).toEqual(screen.getByDisplayValue('YouTube'));
    expect(screen.getByLabelText('Song URL')).toEqual(screen.getByDisplayValue('https://www.youtube.com/watch?v=EA2BNB_4m3g'));
    expect(screen.getByLabelText('Is Primary?')).toBeChecked();

    await waitFor(() => userEvent.click(screen.getByText('Update Song')));

    expect(mockUpdateSong).toHaveBeenCalledTimes(1);
    expect(mockUpdateSong).toHaveBeenCalledWith(12, {
      name: 'Ambulance Blues',
      artistId: 2,
      year: 1973,
      genreIds: [ 1, 2 ],
      sources: [ { service: 'YouTube', url: 'https://www.youtube.com/watch?v=EA2BNB_4m3g', isPrimary: true }]
    });

    await waitFor(() => expect(history.location.pathname).toEqual('/songs/12'));
  });
});