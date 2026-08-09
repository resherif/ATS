--
-- PostgreSQL database dump
--

\restrict kJTTcZ4bdmVgxWkJgK5YSH7XKLsW66sfSrdvsOl0zCDwH3aRnoXPc5bcNvHSRn8

-- Dumped from database version 13.23
-- Dumped by pg_dump version 18.1

-- Started on 2026-07-09 00:06:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 207 (class 1259 OID 16782)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    application_id integer NOT NULL,
    candidate_id integer,
    job_id integer,
    status character varying(15) DEFAULT 'Applied'::character varying NOT NULL,
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    resume_url text
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16780)
-- Name: applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_application_id_seq OWNER TO postgres;

--
-- TOC entry 3074 (class 0 OID 0)
-- Dependencies: 206
-- Name: applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_application_id_seq OWNED BY public.applications.application_id;


--
-- TOC entry 205 (class 1259 OID 16771)
-- Name: candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidates (
    candidate_id integer NOT NULL,
    candidate_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.candidates OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16758)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    job_title character varying(100) NOT NULL,
    description text NOT NULL,
    status character varying(20) DEFAULT 'published'::character varying,
    requirements text NOT NULL,
    experience_level character varying(20) NOT NULL,
    salary_range character varying(30),
    employment_type character varying(20) NOT NULL,
    department character varying(50) NOT NULL,
    posted_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    location character varying(100)
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16855)
-- Name: candidate_list_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.candidate_list_view AS
 SELECT c.candidate_id,
    c.candidate_name,
    c.email,
    c.created_at,
    a.application_id,
    a.status,
    a.applied_at,
    a.job_id,
    j.job_title AS role,
    a.resume_url
   FROM ((public.candidates c
     LEFT JOIN public.applications a ON ((c.candidate_id = a.candidate_id)))
     LEFT JOIN public.jobs j ON ((a.job_id = j.id)));


ALTER VIEW public.candidate_list_view OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16803)
-- Name: candidate_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidate_skills (
    candidate_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.candidate_skills OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16769)
-- Name: candidates_candidate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidates_candidate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidates_candidate_id_seq OWNER TO postgres;

--
-- TOC entry 3075 (class 0 OID 0)
-- Dependencies: 204
-- Name: candidates_candidate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidates_candidate_id_seq OWNED BY public.candidates.candidate_id;


--
-- TOC entry 211 (class 1259 OID 16835)
-- Name: interview; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interview (
    interview_id integer NOT NULL,
    application_id integer NOT NULL,
    interview_date timestamp with time zone,
    feedback text,
    score integer,
    CONSTRAINT interview_score_check CHECK (((score >= 0) AND (score <= 100)))
);


ALTER TABLE public.interview OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16833)
-- Name: interview_interview_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interview_interview_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interview_interview_id_seq OWNER TO postgres;

--
-- TOC entry 3076 (class 0 OID 0)
-- Dependencies: 210
-- Name: interview_interview_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interview_interview_id_seq OWNED BY public.interview.interview_id;


--
-- TOC entry 209 (class 1259 OID 16818)
-- Name: job_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_skills (
    job_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.job_skills OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16756)
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- TOC entry 3077 (class 0 OID 0)
-- Dependencies: 202
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- TOC entry 201 (class 1259 OID 16748)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    skill_id integer NOT NULL,
    skill_name character varying(50) NOT NULL
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16746)
-- Name: skills_skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_skill_id_seq OWNER TO postgres;

--
-- TOC entry 3078 (class 0 OID 0)
-- Dependencies: 200
-- Name: skills_skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_skill_id_seq OWNED BY public.skills.skill_id;


--
-- TOC entry 2895 (class 2604 OID 16785)
-- Name: applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN application_id SET DEFAULT nextval('public.applications_application_id_seq'::regclass);


--
-- TOC entry 2893 (class 2604 OID 16774)
-- Name: candidates candidate_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates ALTER COLUMN candidate_id SET DEFAULT nextval('public.candidates_candidate_id_seq'::regclass);


--
-- TOC entry 2898 (class 2604 OID 16838)
-- Name: interview interview_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview ALTER COLUMN interview_id SET DEFAULT nextval('public.interview_interview_id_seq'::regclass);


--
-- TOC entry 2890 (class 2604 OID 16761)
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- TOC entry 2889 (class 2604 OID 16751)
-- Name: skills skill_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN skill_id SET DEFAULT nextval('public.skills_skill_id_seq'::regclass);


--
-- TOC entry 3063 (class 0 OID 16782)
-- Dependencies: 207
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (application_id, candidate_id, job_id, status, applied_at, resume_url) FROM stdin;
1	1	1	Interview	2024-11-01 12:00:00+02	https://storage.example.com/resumes/sara_ahmed.pdf
2	2	2	Offer	2024-11-03 11:30:00+02	https://storage.example.com/resumes/omar_hassan.pdf
3	3	1	Screening	2024-11-05 13:00:00+02	https://storage.example.com/resumes/nour_ali.pdf
4	4	5	Applied	2024-11-07 16:00:00+02	https://storage.example.com/resumes/karim_youssef.pdf
5	5	4	Rejected	2024-11-08 10:00:00+02	https://storage.example.com/resumes/layla_ibrahim.pdf
6	6	3	Interview	2024-11-10 12:00:00+02	https://storage.example.com/resumes/mohamed_tarek.pdf
7	7	5	Screening	2024-11-11 15:00:00+02	https://storage.example.com/resumes/rana_mostafa.pdf
8	8	6	Applied	2024-11-12 11:00:00+02	https://storage.example.com/resumes/ahmed_samy.pdf
9	1	3	Applied	2024-11-13 12:30:00+02	https://storage.example.com/resumes/sara_ahmed.pdf
10	3	3	Rejected	2024-11-14 13:00:00+02	https://storage.example.com/resumes/nour_ali.pdf
\.


--
-- TOC entry 3064 (class 0 OID 16803)
-- Dependencies: 208
-- Data for Name: candidate_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidate_skills (candidate_id, skill_id) FROM stdin;
1	1
1	2
1	7
1	8
2	4
2	5
2	11
2	13
3	1
3	3
3	15
3	12
4	9
4	10
4	5
5	14
5	3
5	7
6	1
6	2
6	4
6	6
6	5
7	9
7	10
7	12
8	13
8	12
8	11
8	4
\.


--
-- TOC entry 3061 (class 0 OID 16771)
-- Dependencies: 205
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidates (candidate_id, candidate_name, email, created_at) FROM stdin;
1	Sara Ahmed	sara.ahmed@gmail.com	2026-07-08 22:47:49.054944
2	Omar Hassan	omar.hassan@gmail.com	2026-07-08 22:47:49.054944
3	Nour Ali	nour.ali@gmail.com	2026-07-08 22:47:49.054944
4	Karim Youssef	karim.youssef@gmail.com	2026-07-08 22:47:49.054944
5	Layla Ibrahim	layla.ibrahim@gmail.com	2026-07-08 22:47:49.054944
6	Mohamed Tarek	mo.tarek@gmail.com	2026-07-08 22:47:49.054944
7	Rana Mostafa	rana.mostafa@gmail.com	2026-07-08 22:47:49.054944
8	Ahmed Samy	ahmed.samy@gmail.com	2026-07-08 22:47:49.054944
\.


--
-- TOC entry 3067 (class 0 OID 16835)
-- Dependencies: 211
-- Data for Name: interview; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interview (interview_id, application_id, interview_date, feedback, score) FROM stdin;
4	1	2024-11-15 12:00:00+02	Strong React knowledge, good problem solving. Needs more TypeScript depth.	74
5	2	2024-11-16 13:00:00+02	Excellent backend skills. Clear communicator. Highly recommended.	91
6	6	2024-11-18 16:00:00+02	Solid full stack experience. Good architecture decisions.	85
\.


--
-- TOC entry 3065 (class 0 OID 16818)
-- Dependencies: 209
-- Data for Name: job_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_skills (job_id, skill_id) FROM stdin;
1	1
1	2
1	3
1	7
1	8
2	4
2	5
2	10
2	11
2	13
3	1
3	2
3	4
3	6
3	5
3	12
4	14
4	3
5	9
5	10
5	5
6	13
6	12
6	11
\.


--
-- TOC entry 3059 (class 0 OID 16758)
-- Dependencies: 203
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, job_title, description, status, requirements, experience_level, salary_range, employment_type, department, posted_date, location) FROM stdin;
1	Frontend Developer	Build and maintain responsive web applications using React and TypeScript.	published	Strong knowledge of React, TypeScript, and modern CSS. Experience with REST APIs.	Junior	8000-12000 EGP	Full-time	Engineering	2026-07-08 22:47:49.054944	Cairo, Egypt
2	Backend Developer	Design and implement scalable REST APIs using Node.js and PostgreSQL.	published	Solid experience with Node.js, Express, PostgreSQL, and Docker.	Mid	15000-22000 EGP	Full-time	Engineering	2026-07-08 22:47:49.054944	Remote
3	Full Stack Developer	Work across the entire stack — React frontend and Node.js backend with Supabase.	published	Proficient in React, Node.js, SQL, and cloud deployment.	Senior	25000-35000 EGP	Full-time	Engineering	2026-07-08 22:47:49.054944	Cairo, Egypt
4	UI/UX Designer	Create user-friendly interfaces and design systems for web products.	published	Experience with Figma, design systems, and user research.	Mid	10000-16000 EGP	Full-time	Design	2026-07-08 22:47:49.054944	Alexandria, Egypt
5	Data Analyst	Analyze business data and build dashboards to support decision making.	draft	Strong SQL skills, Python knowledge, and experience with data visualization tools.	Junior	9000-13000 EGP	Full-time	Data	2026-07-08 22:47:49.054944	Remote
6	DevOps Engineer	Manage CI/CD pipelines, cloud infrastructure, and container orchestration.	published	Experience with Docker, Git workflows, and Linux environments.	Senior	28000-40000 EGP	Contract	Infrastructure	2026-07-08 22:47:49.054944	Cairo, Egypt
\.


--
-- TOC entry 3057 (class 0 OID 16748)
-- Dependencies: 201
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (skill_id, skill_name) FROM stdin;
1	React
2	TypeScript
3	JavaScript
4	Node.js
5	PostgreSQL
6	Supabase
7	Tailwind CSS
8	Redux
9	Python
10	SQL
11	REST APIs
12	Git
13	Docker
14	Figma
15	Next.js
\.


--
-- TOC entry 3079 (class 0 OID 0)
-- Dependencies: 206
-- Name: applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_application_id_seq', 10, true);


--
-- TOC entry 3080 (class 0 OID 0)
-- Dependencies: 204
-- Name: candidates_candidate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidates_candidate_id_seq', 8, true);


--
-- TOC entry 3081 (class 0 OID 0)
-- Dependencies: 210
-- Name: interview_interview_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interview_interview_id_seq', 6, true);


--
-- TOC entry 3082 (class 0 OID 0)
-- Dependencies: 202
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 18, true);


--
-- TOC entry 3083 (class 0 OID 0)
-- Dependencies: 200
-- Name: skills_skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_skill_id_seq', 45, true);


--
-- TOC entry 2911 (class 2606 OID 16792)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 2913 (class 2606 OID 16807)
-- Name: candidate_skills candidate_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_skills
    ADD CONSTRAINT candidate_skills_pkey PRIMARY KEY (candidate_id, skill_id);


--
-- TOC entry 2907 (class 2606 OID 16779)
-- Name: candidates candidates_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_email_key UNIQUE (email);


--
-- TOC entry 2909 (class 2606 OID 16777)
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (candidate_id);


--
-- TOC entry 2917 (class 2606 OID 16844)
-- Name: interview interview_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview
    ADD CONSTRAINT interview_pkey PRIMARY KEY (interview_id);


--
-- TOC entry 2915 (class 2606 OID 16822)
-- Name: job_skills job_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_skills
    ADD CONSTRAINT job_skills_pkey PRIMARY KEY (job_id, skill_id);


--
-- TOC entry 2905 (class 2606 OID 16768)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 2901 (class 2606 OID 16753)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (skill_id);


--
-- TOC entry 2903 (class 2606 OID 16755)
-- Name: skills skills_skill_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_skill_name_key UNIQUE (skill_name);


--
-- TOC entry 2918 (class 2606 OID 16793)
-- Name: applications applications_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(candidate_id) ON DELETE CASCADE;


--
-- TOC entry 2919 (class 2606 OID 16798)
-- Name: applications applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- TOC entry 2920 (class 2606 OID 16808)
-- Name: candidate_skills candidate_skills_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_skills
    ADD CONSTRAINT candidate_skills_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(candidate_id) ON DELETE CASCADE;


--
-- TOC entry 2921 (class 2606 OID 16813)
-- Name: candidate_skills candidate_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidate_skills
    ADD CONSTRAINT candidate_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id) ON DELETE CASCADE;


--
-- TOC entry 2924 (class 2606 OID 16845)
-- Name: interview interview_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview
    ADD CONSTRAINT interview_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(application_id) ON DELETE CASCADE;


--
-- TOC entry 2922 (class 2606 OID 16823)
-- Name: job_skills job_skills_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_skills
    ADD CONSTRAINT job_skills_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- TOC entry 2923 (class 2606 OID 16828)
-- Name: job_skills job_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_skills
    ADD CONSTRAINT job_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(skill_id) ON DELETE CASCADE;


--
-- TOC entry 3073 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2026-07-09 00:06:36

--
-- PostgreSQL database dump complete
--

\unrestrict kJTTcZ4bdmVgxWkJgK5YSH7XKLsW66sfSrdvsOl0zCDwH3aRnoXPc5bcNvHSRn8

