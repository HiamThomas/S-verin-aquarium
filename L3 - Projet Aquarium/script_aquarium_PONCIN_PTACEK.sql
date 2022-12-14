PGDMP     !    3            
    x            Aquarium    13.0    13.0     ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    16417    Aquarium    DATABASE     f   CREATE DATABASE "Aquarium" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'French_France.1252';
    DROP DATABASE "Aquarium";
                postgres    false            ?            1259    16479    backgrounds    TABLE     i   CREATE TABLE public.backgrounds (
    backgroundid integer NOT NULL,
    userid integer,
    url text
);
    DROP TABLE public.backgrounds;
       public         heap    postgres    false            ?            1259    16477    backgrounds_backgroundid_seq    SEQUENCE     ?   CREATE SEQUENCE public.backgrounds_backgroundid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.backgrounds_backgroundid_seq;
       public          postgres    false    205            ?           0    0    backgrounds_backgroundid_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.backgrounds_backgroundid_seq OWNED BY public.backgrounds.backgroundid;
          public          postgres    false    204            ?            1259    16431    fishs    TABLE     ?   CREATE TABLE public.fishs (
    fishid integer NOT NULL,
    userid integer,
    name text,
    color integer,
    speed real,
    size real,
    url text,
    flip boolean
);
    DROP TABLE public.fishs;
       public         heap    postgres    false            ?            1259    16429    fishs_fishId_seq    SEQUENCE     ?   CREATE SEQUENCE public."fishs_fishId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."fishs_fishId_seq";
       public          postgres    false    203            ?           0    0    fishs_fishId_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."fishs_fishId_seq" OWNED BY public.fishs.fishid;
          public          postgres    false    202            ?            1259    16420    users    TABLE     x   CREATE TABLE public.users (
    userid integer NOT NULL,
    email text,
    password text,
    backgroundid integer
);
    DROP TABLE public.users;
       public         heap    postgres    false            ?            1259    16418    users_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    201            ?           0    0    users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.userid;
          public          postgres    false    200            3           2604    16482    backgrounds backgroundid    DEFAULT     ?   ALTER TABLE ONLY public.backgrounds ALTER COLUMN backgroundid SET DEFAULT nextval('public.backgrounds_backgroundid_seq'::regclass);
 G   ALTER TABLE public.backgrounds ALTER COLUMN backgroundid DROP DEFAULT;
       public          postgres    false    205    204    205            2           2604    16434    fishs fishid    DEFAULT     n   ALTER TABLE ONLY public.fishs ALTER COLUMN fishid SET DEFAULT nextval('public."fishs_fishId_seq"'::regclass);
 ;   ALTER TABLE public.fishs ALTER COLUMN fishid DROP DEFAULT;
       public          postgres    false    203    202    203            1           2604    16423    users userid    DEFAULT     h   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_id_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    200    201    201            ;           2606    16487    backgrounds backgrounds_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.backgrounds
    ADD CONSTRAINT backgrounds_pkey PRIMARY KEY (backgroundid);
 F   ALTER TABLE ONLY public.backgrounds DROP CONSTRAINT backgrounds_pkey;
       public            postgres    false    205            8           2606    16439    fishs fishs_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.fishs
    ADD CONSTRAINT fishs_pkey PRIMARY KEY (fishid);
 :   ALTER TABLE ONLY public.fishs DROP CONSTRAINT fishs_pkey;
       public            postgres    false    203            6           2606    16428    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    201            4           1259    16499    fki_background_fkey    INDEX     M   CREATE INDEX fki_background_fkey ON public.users USING btree (backgroundid);
 '   DROP INDEX public.fki_background_fkey;
       public            postgres    false    201            <           1259    16493    fki_backgrounds_fkey    INDEX     N   CREATE INDEX fki_backgrounds_fkey ON public.backgrounds USING btree (userid);
 (   DROP INDEX public.fki_backgrounds_fkey;
       public            postgres    false    205            9           1259    16445    fki_userId_fkey    INDEX     E   CREATE INDEX "fki_userId_fkey" ON public.fishs USING btree (userid);
 %   DROP INDEX public."fki_userId_fkey";
       public            postgres    false    203            =           2606    16494    users background_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.users
    ADD CONSTRAINT background_fkey FOREIGN KEY (backgroundid) REFERENCES public.backgrounds(backgroundid) NOT VALID;
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT background_fkey;
       public          postgres    false    2875    205    201            ?           2606    16488    backgrounds backgrounds_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.backgrounds
    ADD CONSTRAINT backgrounds_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) NOT VALID;
 F   ALTER TABLE ONLY public.backgrounds DROP CONSTRAINT backgrounds_fkey;
       public          postgres    false    201    2870    205            >           2606    16451    fishs userId_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.fishs
    ADD CONSTRAINT "userId_fkey" FOREIGN KEY (userid) REFERENCES public.users(userid) NOT VALID;
 =   ALTER TABLE ONLY public.fishs DROP CONSTRAINT "userId_fkey";
       public          postgres    false    201    2870    203           