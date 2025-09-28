-- Migration: Add overlapping sessions for conflict detection testing
-- Created: 2025-09-28
-- Purpose: Add sample sessions that overlap with existing ones to test conflict detection

-- Insert additional participants for new sessions
INSERT INTO participants (participant_id, first_name, last_name, organization, email, bio) VALUES
  (9, 'Isabel', 'Chen', 'Facebook AI', 'isabel.chen@meta.com', 'AI fairness and bias detection researcher.'),
  (10, 'Jack', 'Wilson', 'Sequoia Capital', 'jack.wilson@sequoiacap.com', 'AI venture capitalist and investor.'),
  (11, 'Kate', 'Brown', 'Google Translate', 'kate.brown@google.com', 'Neural machine translation expert.'),
  (12, 'Leo', 'Rodriguez', 'Tesla', 'leo.rodriguez@tesla.com', 'Autonomous vehicle engineering lead.'),
  (13, 'Maya', 'Singh', 'Unity Technologies', 'maya.singh@unity.com', 'AI in gaming and interactive media.'),
  (14, 'Noah', 'Taylor', 'IBM Quantum', 'noah.taylor@ibm.com', 'Quantum machine learning researcher.'),
  (15, 'Olivia', 'Davis', 'Woebot Health', 'olivia.davis@woebot.io', 'AI mental health applications specialist.'),
  (16, 'Paul', 'Martinez', 'Apple Privacy', 'paul.martinez@apple.com', 'Privacy-preserving machine learning expert.');

-- Insert overlapping sessions for testing conflict detection
INSERT INTO sessions (session_id, conference_id, track_id, title, description, session_date, start_time, end_time, session_type, session_url) VALUES
  -- July 10th overlapping sessions
  (11, 1, 4, 'AI Bias and Fairness', 'Discussion on bias detection and mitigation in AI systems.', '2025-07-10', '09:30', '10:30', 'Talk', null), -- Overlaps with sessions 1 & 2
  (12, 1, 6, 'AI Investment Trends', 'Current trends in AI venture capital and funding.', '2025-07-10', '10:00', '11:00', 'Panel', null), -- Overlaps with sessions 1 & 2
  (17, 1, 3, 'AI Mental Health Apps', 'Applications of AI in mental health and therapy.', '2025-07-10', '15:30', '16:30', 'Workshop', null), -- Overlaps with session 10
  
  -- July 11th overlapping sessions
  (13, 1, 2, 'Neural Machine Translation', 'Advances in automated language translation.', '2025-07-11', '08:30', '09:30', 'Talk', null), -- Overlaps with session 3
  (14, 1, 5, 'Autonomous Vehicles', 'Self-driving cars and the future of transportation.', '2025-07-11', '11:30', '12:30', 'Talk', null), -- Overlaps with session 5
  (18, 1, 4, 'Privacy in AI Systems', 'Data privacy challenges in machine learning.', '2025-07-11', '13:30', '14:30', 'Panel', null), -- Overlaps with session 8
  
  -- July 12th overlapping sessions
  (16, 1, 1, 'Quantum Machine Learning', 'Intersection of quantum computing and ML.', '2025-07-12', '10:30', '11:30', 'Talk', null), -- Overlaps with sessions 6 & 9
  (15, 1, 7, 'AI in Gaming', 'How AI is revolutionizing game development and NPC behavior.', '2025-07-12', '14:30', '15:30', 'Talk', null); -- Overlaps with session 4

-- Link participants to new sessions
INSERT INTO session_participants (session_id, participant_id, role) VALUES
  (11, 9, 'Speaker'),
  (11, 3, 'Co-Speaker'),
  (12, 10, 'Panelist'),
  (12, 6, 'Panelist'),
  (13, 11, 'Speaker'),
  (14, 12, 'Speaker'),
  (15, 13, 'Speaker'),
  (16, 14, 'Speaker'),
  (17, 15, 'Speaker'),
  (18, 16, 'Speaker'),
  (18, 3, 'Panelist');