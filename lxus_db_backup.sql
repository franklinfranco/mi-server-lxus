--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: jurados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jurados (
    id integer NOT NULL,
    usuario_id integer,
    foto_url text
);


ALTER TABLE public.jurados OWNER TO postgres;

--
-- Name: jurados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jurados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jurados_id_seq OWNER TO postgres;

--
-- Name: jurados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jurados_id_seq OWNED BY public.jurados.id;


--
-- Name: participantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participantes (
    id integer NOT NULL,
    usuario_id integer,
    foto_url text
);


ALTER TABLE public.participantes OWNER TO postgres;

--
-- Name: participantes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participantes_id_seq OWNER TO postgres;

--
-- Name: participantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participantes_id_seq OWNED BY public.participantes.id;


--
-- Name: presentaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presentaciones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha date NOT NULL,
    orden integer NOT NULL,
    ya_canto boolean DEFAULT false,
    estado character varying(20) DEFAULT 'pendiente'::character varying
);


ALTER TABLE public.presentaciones OWNER TO postgres;

--
-- Name: presentaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.presentaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.presentaciones_id_seq OWNER TO postgres;

--
-- Name: presentaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.presentaciones_id_seq OWNED BY public.presentaciones.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    contrasena character varying(255) NOT NULL,
    rol character varying(20) NOT NULL,
    foto text,
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['jurado'::character varying, 'participante'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: votaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.votaciones (
    id integer NOT NULL,
    jurado_id integer NOT NULL,
    participante_id integer NOT NULL,
    presentacion_id integer NOT NULL,
    puntaje integer,
    CONSTRAINT votaciones_puntaje_check CHECK (((puntaje >= 1) AND (puntaje <= 10)))
);


ALTER TABLE public.votaciones OWNER TO postgres;

--
-- Name: votaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.votaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.votaciones_id_seq OWNER TO postgres;

--
-- Name: votaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.votaciones_id_seq OWNED BY public.votaciones.id;


--
-- Name: jurados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jurados ALTER COLUMN id SET DEFAULT nextval('public.jurados_id_seq'::regclass);


--
-- Name: participantes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes ALTER COLUMN id SET DEFAULT nextval('public.participantes_id_seq'::regclass);


--
-- Name: presentaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentaciones ALTER COLUMN id SET DEFAULT nextval('public.presentaciones_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: votaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votaciones ALTER COLUMN id SET DEFAULT nextval('public.votaciones_id_seq'::regclass);


--
-- Data for Name: jurados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jurados (id, usuario_id, foto_url) FROM stdin;
7	13	\N
8	14	\N
9	15	\N
10	17	\N
\.


--
-- Data for Name: participantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participantes (id, usuario_id, foto_url) FROM stdin;
3	9	\N
4	10	\N
5	11	\N
6	12	\N
\.


--
-- Data for Name: presentaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presentaciones (id, usuario_id, fecha, orden, ya_canto, estado) FROM stdin;
7	9	2025-05-23	1	t	pendiente
8	12	2025-05-23	2	t	pendiente
9	11	2025-05-23	3	t	pendiente
10	10	2025-05-23	4	t	finalizado
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, contrasena, rol, foto) FROM stdin;
2	Franklin Franco	franklinfranco@gmail.com	$2b$10$43gWE.Y0fULt3tdhvQne4eDWUOZ25cnlavsGY7uHK5CydA2foPl3.	jurado	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747720242/qj793vjsuhfo04refd9g.png
9	Participante1	participante1@gmail.com	$2b$10$7bJK27k5uDTAnzksMuHQ7u4IHnZjEeEHkWv5c2Olkftsn6Fz7.SUK	participante	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747924497/igq48dbe7b8bm8ww95yi.jpg
10	participante2	participante2@gmail.com	$2b$10$Pux1cbMZaOk9ru1.80vIC.ltQ9mQb9fOVrv2s.iRavmmJJPd0VdVG	participante	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747924570/juo0u2rjrawfccvhoo2r.jpg
11	participante3	participante3@gmail.com	$2b$10$afLGwzyZetT4mCaBmVcxY.Dg5XKvhDsYmK3IsbmB2.PFHSTOOuW7e	participante	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747924598/udzp6xbeuer4oyuar8ad.png
12	participante4	participante4@gmail.com	$2b$10$TmeV.He5pUJm.KcFHwZ3ben3VPcMvD2ntRDZBrEZu6M0PzEWqWdl2	participante	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747924628/pshjnwmm5m53rihi0n4b.jpg
13	jurado1	jurado1@gmail.com	$2b$10$MY7L05bU6eI0HIUV7ahVo.quMsOhDh85.SSV.ueR0UlISssaoc4Ii	jurado	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747924689/ghtugz48odjcnstminsi.jpg
14	jurado2	jurado2@gmail.com	$2b$10$lI9WfewRz3oeCqJnbWnGJ.44XLcWEeXzks.zAT4WETIcs1Fly32SO	jurado	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747924714/h8wpjiok5apbbyqwm3zh.png
15	jurado3	jurado3@gmail.com	$2b$10$G10mpb/Ipvy3X2MOASIlC.glvcOgE066nCyiMQObS9697dXDoIuBK	jurado	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1747924735/oaw8twx4i6ecmijpplwl.jpg
17	Jurado 4	jurado4@gmail.com	$2b$10$pgr7kZgXtgfYMEm1Sq0BYe.XLVjKTFe/Kkf.hZqkvJU/XqRtq.BSu	jurado	https://res.cloudinary.com/dxp7qyv1o/image/upload/v1748026034/qq5ew6us6d6rdwlvkzxj.jpg
\.


--
-- Data for Name: votaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.votaciones (id, jurado_id, participante_id, presentacion_id, puntaje) FROM stdin;
3	15	9	7	5
6	13	9	7	1
8	14	9	7	3
9	13	12	8	3
10	14	12	8	5
11	15	12	8	4
12	17	12	8	2
13	17	11	9	5
16	15	10	10	6
\.


--
-- Name: jurados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jurados_id_seq', 10, true);


--
-- Name: participantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participantes_id_seq', 6, true);


--
-- Name: presentaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.presentaciones_id_seq', 10, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 17, true);


--
-- Name: votaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.votaciones_id_seq', 16, true);


--
-- Name: jurados jurados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jurados
    ADD CONSTRAINT jurados_pkey PRIMARY KEY (id);


--
-- Name: participantes participantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes
    ADD CONSTRAINT participantes_pkey PRIMARY KEY (id);


--
-- Name: presentaciones presentaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentaciones
    ADD CONSTRAINT presentaciones_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: votaciones votaciones_jurado_id_presentacion_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votaciones
    ADD CONSTRAINT votaciones_jurado_id_presentacion_id_key UNIQUE (jurado_id, presentacion_id);


--
-- Name: votaciones votaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votaciones
    ADD CONSTRAINT votaciones_pkey PRIMARY KEY (id);


--
-- Name: jurados jurados_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jurados
    ADD CONSTRAINT jurados_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: participantes participantes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participantes
    ADD CONSTRAINT participantes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: presentaciones presentaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presentaciones
    ADD CONSTRAINT presentaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: votaciones votaciones_jurado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votaciones
    ADD CONSTRAINT votaciones_jurado_id_fkey FOREIGN KEY (jurado_id) REFERENCES public.usuarios(id);


--
-- Name: votaciones votaciones_participante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votaciones
    ADD CONSTRAINT votaciones_participante_id_fkey FOREIGN KEY (participante_id) REFERENCES public.usuarios(id);


--
-- Name: votaciones votaciones_presentacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votaciones
    ADD CONSTRAINT votaciones_presentacion_id_fkey FOREIGN KEY (presentacion_id) REFERENCES public.presentaciones(id);


--
-- PostgreSQL database dump complete
--

