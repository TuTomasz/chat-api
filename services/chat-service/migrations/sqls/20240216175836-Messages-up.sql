/* Replace with your SQL commands */
CREATE TABLE Messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  sender_user_id INT,
  receiver_user_id INT,
  message TEXT,
  epoch BIGINT,
  FOREIGN KEY (sender_user_id) REFERENCES Users(user_id),
  FOREIGN KEY (receiver_user_id) REFERENCES Users(user_id),
  INDEX (sender_user_id, receiver_user_id)
);