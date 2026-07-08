ALTER TABLE `leads` MODIFY `status` enum('new','contacted','converted','lost') NOT NULL DEFAULT 'new';
