ALTER TABLE questions ADD COLUMN difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard'));
