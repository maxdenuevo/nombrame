-- Seed del catálogo de nombres. Mismo contenido que src/data/names.ts (el seed
-- local de desarrollo); cuando el backend esté conectado, Postgres es la fuente
-- de verdad y el archivo local desaparece.

insert into public.names (slug, name, gender, origin, meaning) values
  ('emilia', 'Emilia', 'f', 'Latino', 'La que se esfuerza y no se rinde'),
  ('mateo', 'Mateo', 'm', 'Hebreo', 'Regalo de Dios'),
  ('violeta', 'Violeta', 'f', 'Latino', 'Como la flor, símbolo de modestia'),
  ('leon', 'León', 'm', 'Latino', 'Valiente como el león'),
  ('noa', 'Noa', 'x', 'Hebreo', 'Movimiento, descanso'),
  ('isidora', 'Isidora', 'f', 'Griego', 'Regalo de la diosa Isis'),
  ('gaspar', 'Gaspar', 'm', 'Persa', 'El que guarda el tesoro'),
  ('maite', 'Maite', 'f', 'Vasco', 'Amada'),
  ('vicente', 'Vicente', 'm', 'Latino', 'El que vence'),
  ('amanda', 'Amanda', 'f', 'Latino', 'Digna de ser amada'),
  ('ariel', 'Ariel', 'x', 'Hebreo', 'León de Dios'),
  ('florencia', 'Florencia', 'f', 'Latino', 'La que florece'),
  ('clemente', 'Clemente', 'm', 'Latino', 'De carácter bondadoso'),
  ('antonia', 'Antonia', 'f', 'Latino', 'Valiosa, inestimable'),
  ('baltazar', 'Baltazar', 'm', 'Asirio', 'Protegido por Dios'),
  ('trinidad', 'Trinidad', 'x', 'Latino', 'Unión de tres en uno'),
  ('guadalupe', 'Guadalupe', 'x', 'Árabe', 'Río de amor escondido'),
  ('salvador', 'Salvador', 'm', 'Latino', 'El que salva'),
  ('julieta', 'Julieta', 'f', 'Latino', 'De raíces fuertes, juvenil'),
  ('maximiliano', 'Maximiliano', 'm', 'Latino', 'El más grande'),
  ('amparo', 'Amparo', 'f', 'Latino', 'La que protege y da refugio'),
  ('emiliano', 'Emiliano', 'm', 'Latino', 'El que trabaja con empeño'),
  ('cruz', 'Cruz', 'x', 'Latino', 'Símbolo de fe y encuentro'),
  ('rafaela', 'Rafaela', 'f', 'Hebreo', 'Sanada por Dios')
on conflict (slug) do nothing;
