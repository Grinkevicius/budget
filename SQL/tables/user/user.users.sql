-- Table: user.users

-- DROP TABLE IF EXISTS "user".users;

CREATE TABLE IF NOT EXISTS "user".users
(
    id bigint NOT NULL DEFAULT nextval('"user".users_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS "user".users
    OWNER to "default";