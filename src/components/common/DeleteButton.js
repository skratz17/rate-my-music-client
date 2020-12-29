import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';

import { Modal } from './Modal';
import { Button } from './Button';

export const DeleteButton = props => {
  const { onDelete, accessibleName, className } = props;

  const [ isDeleting, setIsDeleting ] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsDeleting(false);
  };

  return <>
    <button className={`bg-red-300 hover:bg-red-400 px-2 ${className}`} onClick={() => setIsDeleting(true)}>
      <MdDelete />
      <span className="sr-only">{accessibleName}</span>
    </button>

    <Modal isShowing={isDeleting} onClose={() => setIsDeleting(false)}>
      <div>
        <p>Are you sure you want to delete this item? <strong>It will be deleted permanently!</strong></p>
        <div className="flex justify-end mt-3">
          <Button className="mr-3" onClick={() => setIsDeleting(false)}>Cancel</Button>
          <Button className="bg-red-300 hover:bg-red-400" onClick={handleDelete}>Delete Forever</Button>
        </div>
      </div>
    </Modal>
  </>;
};