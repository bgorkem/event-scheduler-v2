-- Clear all existing data (respecting FK constraints)
-- Order: session_participants, user_scheduled_sessions, sessions, participants, session_tracks, conferences

delete from session_participants;
delete from user_scheduled_sessions;
delete from sessions;
delete from participants;
delete from session_tracks;
delete from conferences;

-- Insert sample conference
insert into conferences (conference_id, name, location, start_date, end_date, url, description) values
  (1, 'AI & Machine Learning Summit 2025', 'London, UK', '2025-07-10', '2025-07-12', 'https://aimlsummit2025.com',
  'A premier conference bringing together AI and ML experts, researchers, and enthusiasts to discuss the latest trends, breakthroughs, and applications in artificial intelligence and machine learning.');

-- Insert sample tracks
insert into session_tracks (track_id, track_name, description) values
  (1, 'Deep Learning', 'Latest advances in deep neural networks'),
  (2, 'Natural Language Processing', 'NLP, LLMs, and language understanding'),
  (3, 'AI in Healthcare', 'AI applications in medicine and healthcare'),
  (4, 'Ethics & Society', 'Ethical and societal impacts of AI'),
  (5, 'Robotics', 'Robotics and automation'),
  (6, 'AI Startups', 'Entrepreneurship in AI'),
  (7, 'Computer Vision', 'Image and video understanding');

-- Insert sample participants (speakers)
insert into participants (participant_id, first_name, last_name, organization, email, bio) values
  (1, 'Alice', 'Nguyen', 'DeepMind', 'alice.nguyen@deepmind.com', 'Researcher in deep learning and reinforcement learning.'),
  (2, 'Bob', 'Smith', 'OpenAI', 'bob.smith@openai.com', 'NLP expert and GPT-4 contributor.'),
  (3, 'Carol', 'Lee', 'Oxford University', 'carol.lee@oxford.ac.uk', 'AI ethics and policy researcher.'),
  (4, 'David', 'Patel', 'NHS', 'david.patel@nhs.uk', 'AI in healthcare specialist.'),
  (5, 'Elena', 'Garcia', 'MIT', 'elena.garcia@mit.edu', 'Robotics and automation professor.'),
  (6, 'Frank', 'Zhou', 'StartupAI', 'frank.zhou@startupai.com', 'AI entrepreneur and founder.'),
  (7, 'Grace', 'Kim', 'Stanford', 'grace.kim@stanford.edu', 'Computer vision researcher.'),
  (8, 'Hiro', 'Tanaka', 'Sony AI', 'hiro.tanaka@sony.com', 'AI in entertainment and robotics.');

-- Insert sample sessions
insert into sessions (session_id, conference_id, track_id, title, description, session_date, start_time, end_time, session_type, session_url) values
  (1, 1, 1, 'State of Deep Learning 2025', 'A keynote on the latest breakthroughs in deep learning.', '2025-07-10', '09:00', '10:00', 'Keynote', null),
  (2, 1, 2, 'Large Language Models in Practice', 'How LLMs are changing the world.', '2025-07-10', '10:30', '11:30', 'Talk', null),
  (3, 1, 3, 'AI for Medical Imaging', 'Applications of AI in radiology and diagnostics.', '2025-07-11', '09:00', '10:00', 'Talk', null),
  (4, 1, 4, 'Ethics of Autonomous Systems', 'Panel discussion on the ethics of self-driving cars and drones.', '2025-07-12', '14:00', '15:00', 'Panel', null),
  (5, 1, 5, 'Robotics in Industry 4.0', 'Robotics and automation in modern manufacturing.', '2025-07-11', '11:00', '12:00', 'Talk', null),
  (6, 1, 6, 'Building an AI Startup', 'Lessons from successful AI entrepreneurs.', '2025-07-12', '10:00', '11:00', 'Workshop', null),
  (7, 1, 7, 'Advances in Computer Vision', 'Recent progress in image and video understanding.', '2025-07-10', '13:00', '14:00', 'Talk', null),
  (8, 1, 2, 'Conversational AI', 'Building next-gen chatbots and assistants.', '2025-07-11', '14:00', '15:00', 'Talk', null),
  (9, 1, 1, 'Reinforcement Learning in the Real World', 'Applications of RL in robotics and games.', '2025-07-12', '11:30', '12:30', 'Talk', null),
  (10, 1, 3, 'AI for Drug Discovery', 'How AI is accelerating pharmaceutical research.', '2025-07-10', '15:00', '16:00', 'Talk', null);

-- Link participants to sessions
insert into session_participants (session_id, participant_id, role) values
  (1, 1, 'Speaker'),
  (2, 2, 'Speaker'),
  (3, 4, 'Speaker'),
  (4, 3, 'Panelist'),
  (5, 5, 'Speaker'),
  (6, 6, 'Speaker'),
  (7, 7, 'Speaker'),
  (8, 2, 'Speaker'),
  (9, 1, 'Speaker'),
  (10, 4, 'Speaker'),
  (10, 8, 'Co-Speaker'); 