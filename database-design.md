DDL for database

```
-- Table for Conferences
CREATE TABLE conferences (
    conference_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    url TEXT,
    description TEXT
);

-- Table for Session Tracks (e.g., "Artificial Intelligence", "Data Engineering and Streaming")
CREATE TABLE session_tracks (
    track_id SERIAL PRIMARY KEY,
    track_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Table for Participants (e.g., speakers, attendees, etc.)
CREATE TABLE participants (
    participant_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    organization VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    bio TEXT,
    UNIQUE (first_name, last_name, organization) -- Added for robustness to identify unique individuals
);

-- Table for Sessions
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    conference_id INT NOT NULL,
    track_id INT, -- Link to session_tracks
    title VARCHAR(500) NOT NULL,
    description TEXT,
    session_date DATE,
    start_time TIME,
    end_time TIME,
    session_type VARCHAR(100), -- e.g., 'Keynote', 'Presentation', 'Demo', 'Panel'
    session_url TEXT, -- URL link to the original session page
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id),
    FOREIGN KEY (track_id) REFERENCES session_tracks(track_id)
);

-- Junction table for many-to-many relationship between sessions and participants
CREATE TABLE session_participants (
    session_id INT NOT NULL,
    participant_id INT NOT NULL,
    role VARCHAR(100), -- e.g., 'Speaker', 'Moderator', 'Panelist'
    PRIMARY KEY (session_id, participant_id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id)
);

```

Test Data

```
-- Insert Conference Data (Databricks Data + AI Summit 2025)
INSERT INTO conferences (name, location, start_date, end_date, url, description) VALUES
('Databricks Data + AI Summit', 'San Francisco, CA (and virtual)', '2025-06-09', '2025-06-12', 'https://www.databricks.com/dataaisummit', 'A cornerstone event for the global data community, exploring the latest in data and AI innovation.');

-- Insert Session Tracks
INSERT INTO session_tracks (track_name) VALUES
('Data and AI Governance'),
('Data Engineering and Streaming'),
('Artificial Intelligence'),
('Data Strategy'),
('Data Warehousing'),
('Data Lakehouse Architecture and Implementation')
ON CONFLICT (track_name) DO NOTHING; -- Prevents duplicate inserts if run multiple times

-- Insert Participants and Sessions [8]
-- Note: Date and Time are only available for "A Conversation With AI influencer Josue Bogran" in the provided snippet.
-- All sessions are assumed 'Presentation' type as specific types (demo, keynote) are not provided in the snippet.

-- Session: “What I Wish I Had Known in My Last SOC.” Confessions of a Cybersecurity Executive
INSERT INTO participants (first_name, last_name, organization) VALUES ('B', 'H', 'Zigguratum Inc') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data and AI Governance'), '“What I Wish I Had Known in My Last SOC.” Confessions of a Cybersecurity Executive', 'Presentation', 'https://www.databricks.com/dataaisummit/session/what-i-wish-i-had-known-my-last-soc-confessions-cybersecurity-executive');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = '“What I Wish I Had Known in My Last SOC.” Confessions of a Cybersecurity Executive'), (SELECT participant_id FROM participants WHERE first_name = 'B' AND last_name = 'H' AND organization = 'Zigguratum Inc'), 'Speaker');

-- Session: 10+ Reasons to Use Databricks’ Delta Live Tables for Your Next Data Processing Project
INSERT INTO participants (first_name, last_name, organization) VALUES ('Jacek', 'Laskowski', 'japila.pl') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Engineering and Streaming'), '10+ Reasons to Use Databricks’ Delta Live Tables for Your Next Data Processing Project', 'Presentation', 'https://www.databricks.com/dataaisummit/session/10-reasons-use-databricks-delta-live-tables-your-next-data-processing');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = '10+ Reasons to Use Databricks’ Delta Live Tables for Your Next Data Processing Project'), (SELECT participant_id FROM participants WHERE first_name = 'Jacek' AND last_name = 'Laskowski' AND organization = 'japila.pl'), 'Speaker');

-- Session: A Comprehensive Guide to Streaming on the Data Intelligence Platform
INSERT INTO participants (first_name, last_name, organization) VALUES ('Indrajit', 'Roy', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Ray', 'Zhu', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Engineering and Streaming'), 'A Comprehensive Guide to Streaming on the Data Intelligence Platform', 'Presentation', 'https://www.databricks.com/dataaisummit/session/comprehensive-guide-streaming-data-intelligence-platform');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Comprehensive Guide to Streaming on the Data Intelligence Platform'), (SELECT participant_id FROM participants WHERE first_name = 'Indrajit' AND last_name = 'Roy' AND organization = 'Databricks'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Comprehensive Guide to Streaming on the Data Intelligence Platform'), (SELECT participant_id FROM participants WHERE first_name = 'Ray' AND last_name = 'Zhu' AND organization = 'Databricks'), 'Speaker');

-- Session: A Conversation With AI influencer Josue Bogran
INSERT INTO participants (first_name, last_name, organization) VALUES ('Josue', 'Bogran', 'JosueBogran.com & zeb.co') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_date, start_time, end_time, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Strategy'), 'A Conversation With AI influencer Josue Bogran', '2025-06-12', '14:35:00', '14:50:00', 'Presentation', 'https://www.databricks.com/dataaisummit/session/conversation-ai-influencer-josue-bogran');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Conversation With AI influencer Josue Bogran'), (SELECT participant_id FROM participants WHERE first_name = 'Josue' AND last_name = 'Bogran' AND organization = 'JosueBogran.com & zeb.co'), 'Speaker');

-- Session: A Japanese Mega-Bank’s Journey to a Modern, GenAI-Powered, Governed Data Platform
INSERT INTO participants (first_name, last_name, organization) VALUES ('Anshul', 'Wadhawan', 'Deloitte Consulting LLP') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Gordon', 'Wilson', 'Sumitomo Mitsui Banking Corporation') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Warehousing'), 'A Japanese Mega-Bank’s Journey to a Modern, GenAI-Powered, Governed Data Platform', 'Presentation', 'https://www.databricks.com/dataaisummit/session/japanese-mega-banks-journey-modern-genai-powered-governed-data-platform');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Japanese Mega-Bank’s Journey to a Modern, GenAI-Powered, Governed Data Platform'), (SELECT participant_id FROM participants WHERE first_name = 'Anshul' AND last_name = 'Wadhawan' AND organization = 'Deloitte Consulting LLP'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Japanese Mega-Bank’s Journey to a Modern, GenAI-Powered, Governed Data Platform'), (SELECT participant_id FROM participants WHERE first_name = 'Gordon' AND last_name = 'Wilson' AND organization = 'Sumitomo Mitsui Banking Corporation'), 'Speaker');

-- Session: A No-Code ML Forecasting Platform for Retail and CPG Companies
INSERT INTO participants (first_name, last_name, organization) VALUES ('Moez', 'Ali', 'Antuit - A Zebra Technologies company') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Artificial Intelligence'), 'A No-Code ML Forecasting Platform for Retail and CPG Companies', 'Presentation', 'https://www.databricks.com/dataaisummit/session/no-code-ml-forecasting-platform-retail-and-cpg-companies');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A No-Code ML Forecasting Platform for Retail and CPG Companies'), (SELECT participant_id FROM participants WHERE first_name = 'Moez' AND last_name = 'Ali' AND organization = 'Antuit - A Zebra Technologies company'), 'Speaker');

-- Session: A Practical Roadmap to Becoming an Expert Databricks Data Engineer
INSERT INTO participants (first_name, last_name, organization) VALUES ('Derar', 'Alhussein', 'Acadford') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Engineering and Streaming'), 'A Practical Roadmap to Becoming an Expert Databricks Data Engineer', 'Presentation', 'https://www.databricks.com/dataaisummit/session/practical-roadmap-becoming-expert-databricks-data-engineer');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Practical Roadmap to Becoming an Expert Databricks Data Engineer'), (SELECT participant_id FROM participants WHERE first_name = 'Derar' AND last_name = 'Alhussein' AND organization = 'Acadford'), 'Speaker');

-- Session: A Practitioner’s Guide to Databricks Serverless
INSERT INTO participants (first_name, last_name, organization) VALUES ('Prashanth Babu Velanati', 'Venkata', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Lakehouse Architecture and Implementation'), 'A Practitioner’s Guide to Databricks Serverless', 'Presentation', 'https://www.databricks.com/dataaisummit/session/practitioners-guide-databricks-serverless');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Practitioner’s Guide to Databricks Serverless'), (SELECT participant_id FROM participants WHERE first_name = 'Prashanth Babu Velanati' AND last_name = 'Venkata' AND organization = 'Databricks'), 'Speaker');

-- Session: A Prescription for Success: Leveraging DABs for Faster Deployment and Better Patient Outcomes
INSERT INTO participants (first_name, last_name, organization) VALUES ('Brendon', 'Allen', 'Health Catalyst') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Alex', 'Owen', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Lakehouse Architecture and Implementation'), 'A Prescription for Success: Leveraging DABs for Faster Deployment and Better Patient Outcomes', 'Presentation', 'https://www.databricks.com/dataaisummit/session/prescription-success-leveraging-dabs-faster-deployment-and-better');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Prescription for Success: Leveraging DABs for Faster Deployment and Better Patient Outcomes'), (SELECT participant_id FROM participants WHERE first_name = 'Brendon' AND last_name = 'Allen' AND organization = 'Health Catalyst'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Prescription for Success: Leveraging DABs for Faster Deployment and Better Patient Outcomes'), (SELECT participant_id FROM participants WHERE first_name = 'Alex' AND last_name = 'Owen' AND organization = 'Databricks'), 'Speaker');

-- Session: A Unified Solution for Data Management and Model Training With Apache Iceberg and Mosaic Streaming
INSERT INTO participants (first_name, last_name, organization) VALUES ('Zilong', 'Zhou', 'ByteDance') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('jia', 'wei', 'ByteDance') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Lakehouse Architecture and Implementation'), 'A Unified Solution for Data Management and Model Training With Apache Iceberg and Mosaic Streaming', 'Presentation', 'https://www.databricks.com/dataaisummit/session/unified-solution-data-management-and-model-training-apache-iceberg-and');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Unified Solution for Data Management and Model Training With Apache Iceberg and Mosaic Streaming'), (SELECT participant_id FROM participants WHERE first_name = 'Zilong' AND last_name = 'Zhou' AND organization = 'ByteDance'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'A Unified Solution for Data Management and Model Training With Apache Iceberg and Mosaic Streaming'), (SELECT participant_id FROM participants WHERE first_name = 'jia' AND last_name = 'wei' AND organization = 'ByteDance'), 'Speaker');

-- Session: Accelerate End-to-End Multi-Agents on Databricks and DSPy
INSERT INTO participants (first_name, last_name, organization) VALUES ('Austin', 'Choi', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Artificial Intelligence'), 'Accelerate End-to-End Multi-Agents on Databricks and DSPy', 'Presentation', 'https://www.databricks.com/dataaisummit/session/accelerate-end-end-multi-agents-databricks-and-dspy');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerate End-to-End Multi-Agents on Databricks and DSPy'), (SELECT participant_id FROM participants WHERE first_name = 'Austin' AND last_name = 'Choi' AND organization = 'Databricks'), 'Speaker');

-- Session: Accelerating Analytics: Integrating BI and Partner Tools to Databricks SQL
INSERT INTO participants (first_name, last_name, organization) VALUES ('Fuat Can', 'Efeoglu', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Toussaint', 'Webb', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Warehousing'), 'Accelerating Analytics: Integrating BI and Partner Tools to Databricks SQL', 'Presentation', 'https://www.databricks.com/dataaisummit/session/accelerating-analytics-integrating-bi-and-partner-tools-databricks-sql');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Analytics: Integrating BI and Partner Tools to Databricks SQL'), (SELECT participant_id FROM participants WHERE first_name = 'Fuat Can' AND last_name = 'Efeoglu' AND organization = 'Databricks'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Analytics: Integrating BI and Partner Tools to Databricks SQL'), (SELECT participant_id FROM participants WHERE first_name = 'Toussaint' AND last_name = 'Webb' AND organization = 'Databricks'), 'Speaker');

-- Session: Accelerating Data Transformation: Best Practices for Governance, Agility and Innovation
INSERT INTO participants (first_name, last_name, organization) VALUES ('Kevin', 'Wilson', 'NCS Australia') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Warehousing'), 'Accelerating Data Transformation: Best Practices for Governance, Agility and Innovation', 'Presentation', 'https://www.databricks.com/dataaisummit/session/accelerating-data-transformation-best-practices-governance-agility-and');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Data Transformation: Best Practices for Governance, Agility and Innovation'), (SELECT participant_id FROM participants WHERE first_name = 'Kevin' AND last_name = 'Wilson' AND organization = 'NCS Australia'), 'Speaker');

-- Session: Accelerating Growth in Capital Markets: Data-Driven Strategies for Success
INSERT INTO participants (first_name, last_name, organization) VALUES ('Jimmy', 'Kozlow', 'Northern Trust') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Raul', 'Chavarria', 'B3 - Bolsa, Brasil e Balcão') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Antoine', 'Amend', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Bobby', 'Grubert', 'RBC Capital Markets') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Strategy'), 'Accelerating Growth in Capital Markets: Data-Driven Strategies for Success', 'Presentation', 'https://www.databricks.com/dataaisummit/session/accelerating-growth-capital-markets-data-driven-strategies-success');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Growth in Capital Markets: Data-Driven Strategies for Success'), (SELECT participant_id FROM participants WHERE first_name = 'Jimmy' AND last_name = 'Kozlow' AND organization = 'Northern Trust'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Growth in Capital Markets: Data-Driven Strategies for Success'), (SELECT participant_id FROM participants WHERE first_name = 'Raul' AND last_name = 'Chavarria' AND organization = 'B3 - Bolsa, Brasil e Balcão'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Growth in Capital Markets: Data-Driven Strategies for Success'), (SELECT participant_id FROM participants WHERE first_name = 'Antoine' AND last_name = 'Amend' AND organization = 'Databricks'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Growth in Capital Markets: Data-Driven Strategies for Success'), (SELECT participant_id FROM participants WHERE first_name = 'Bobby' AND last_name = 'Grubert' AND organization = 'RBC Capital Markets'), 'Speaker');

-- Session: Accelerating Model Development and Fine-Tuning on Databricks with TwelveLabs
INSERT INTO participants (first_name, last_name, organization) VALUES ('Aiden', 'Lee', 'Twelve Labs, Inc') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('WenWen', 'Gao', 'NVIDIA') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Artificial Intelligence'), 'Accelerating Model Development and Fine-Tuning on Databricks with TwelveLabs', 'Presentation', 'https://www.databricks.com/dataaisummit/session/accelerating-model-development-and-fine-tuning-databricks-twelvelabs');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Model Development and Fine-Tuning on Databricks with TwelveLabs'), (SELECT participant_id FROM participants WHERE first_name = 'Aiden' AND last_name = 'Lee' AND organization = 'Twelve Labs, Inc'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accelerating Model Development and Fine-Tuning on Databricks with TwelveLabs'), (SELECT participant_id FROM participants WHERE first_name = 'WenWen' AND last_name = 'Gao' AND organization = 'NVIDIA'), 'Speaker');

-- Session: Accenture & Avanade | Enterprise Data Joinery for The Standard Insurance Leveraging Databricks on Azure and AI Innovation
INSERT INTO participants (first_name, last_name, organization) VALUES ('Sumanta', 'Paul', 'Accenture') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Data Lakehouse Architecture and Implementation'), 'Accenture & Avanade | Enterprise Data Joinery for The Standard Insurance Leveraging Databricks on Azure and AI Innovation', 'Presentation', 'https://www.databricks.com/dataaisummit/session/accenture-avanade-enterprise-data-joinery-standard-insurance-leveraging');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Accenture & Avanade | Enterprise Data Joinery for The Standard Insurance Leveraging Databricks on Azure and AI Innovation'), (SELECT participant_id FROM participants WHERE first_name = 'Sumanta' AND last_name = 'Paul' AND organization = 'Accenture'), 'Speaker');

-- Session: Achieve Your Mission With AI-Driven Decisions
INSERT INTO participants (first_name, last_name, organization) VALUES ('Suresh', 'Kaudi', 'World Bank') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Richard', 'Schaefer', 'Federal Gov / Lunar Analytics (Ai)') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Molly', 'Just-Behr', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Andrew', 'Hahn', 'Databricks') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Artificial Intelligence'), 'Achieve Your Mission With AI-Driven Decisions', 'Presentation', 'https://www.databricks.com/dataaisummit/session/achieve-your-mission-ai-driven-decisions');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Achieve Your Mission With AI-Driven Decisions'), (SELECT participant_id FROM participants WHERE first_name = 'Suresh' AND last_name = 'Kaudi' AND organization = 'World Bank'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Achieve Your Mission With AI-Driven Decisions'), (SELECT participant_id FROM participants WHERE first_name = 'Richard' AND last_name = 'Schaefer' AND organization = 'Federal Gov / Lunar Analytics (Ai)'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Achieve Your Mission With AI-Driven Decisions'), (SELECT participant_id FROM participants WHERE first_name = 'Molly' AND last_name = 'Just-Behr' AND organization = 'Databricks'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Achieve Your Mission With AI-Driven Decisions'), (SELECT participant_id FROM participants WHERE first_name = 'Andrew' AND last_name = 'Hahn' AND organization = 'Databricks'), 'Speaker');

-- Session: Achieving AI Success with a Solid Data Foundation
INSERT INTO participants (first_name, last_name, organization) VALUES ('Kevin', 'Tollison', 'EY') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO participants (first_name, last_name, organization) VALUES ('Santosh', 'Kudva', 'GE Vernova') ON CONFLICT (first_name, last_name, organization) DO NOTHING;
INSERT INTO sessions (conference_id, track_id, title, session_type, session_url) VALUES
((SELECT conference_id FROM conferences WHERE name = 'Databricks Data + AI Summit'), (SELECT track_id FROM session_tracks WHERE track_name = 'Artificial Intelligence'), 'Achieving AI Success with a Solid Data Foundation', 'Presentation', 'https://www.databricks.com/dataaisummit/session/achieving-ai-success-solid-data-foundation');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Achieving AI Success with a Solid Data Foundation'), (SELECT participant_id FROM participants WHERE first_name = 'Kevin' AND last_name = 'Tollison' AND organization = 'EY'), 'Speaker');
INSERT INTO session_participants (session_id, participant_id, role) VALUES
((SELECT session_id FROM sessions WHERE title = 'Achieving AI Success with a Solid Data Foundation'), (SELECT participant_id FROM participants WHERE first_name = 'Santosh' AND last_name = 'Kudva' AND organization = 'GE Vernova'), 'Speaker');

```
