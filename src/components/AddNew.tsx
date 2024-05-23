// /components/AddNew.tsx

import React, { useState } from 'react';
import styles from './AddNew.module.css';

interface AddNewProps {
  level: 'Grade' | 'Topic' | 'Subtopic' | 'QuestionType';
  parentId?: string;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddNew: React.FC<AddNewProps> = ({ level, parentId, onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName('');
      onClose();
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2>Add New {level}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="name">{level} Name:</label>
          <input
            className={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddNew;
