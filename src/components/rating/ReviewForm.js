import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, WarningText } from '../common';

export const ReviewForm = props => {
  const { review, onSubmit } = props;

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      review: review || ''
    }
  });

  return (
    <form onSubmit={handleSubmit(reviewData => onSubmit(reviewData.review))}>

      <WarningText>{errors.review?.message}</WarningText>
      <textarea name="review" 
        ref={register({ required: 'Review is required.' })} 
        placeholder="Write your review here!"
        className="p-2 my-2 w-full" />

      <Button className="ml-auto" type="submit">Submit</Button>
    </form>
  );
};