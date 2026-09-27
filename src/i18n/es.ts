// Copy en español neutro (ligeramente chileno donde tenga sentido). Ver DESIGN.md, "Voz y microcopy".
export default {
  tabs: {
    swipe: 'Deslizar',
    favorites: 'Favoritos',
    matches: 'Matches',
  },
  deck: {
    like: 'Me gusta',
    pass: 'Paso',
    undo: 'Deshacer el último swipe',
    progress: '%{seen} de %{total}',
    progressA11y: '%{seen} de %{total} nombres vistos',
    changeDeck: 'Cambiar de deck. Deck actual: %{deck}',
    changeFilter: 'Cambiar el filtro de género. Filtro actual: %{filter}',
    a11y: {
      card: '%{name}. %{origin}, %{gender}. %{meaning}',
      hint: 'Desliza a la derecha si te gusta o a la izquierda para pasar. También puedes usar las acciones.',
    },
    exhausted: {
      title: 'Ya viste todos los nombres que tenemos por ahora.',
      subtitle: 'Vuelve más adelante por más.',
      ctaFavorites: 'Ver mis favoritos',
      ctaMatches: 'Ver mis matches',
    },
    done: {
      title: 'Completaste este deck.',
      subtitle: 'Elige otro deck para seguir deslizando.',
      cta: 'Ver mis decks',
    },
    emptyForFilter: {
      title: 'No hay nombres así en este deck.',
      subtitle: 'Prueba con otro filtro o cambia de deck.',
      cta: 'Cambiar de deck',
    },
  },
  favorites: {
    title: 'Tus favoritos',
    count: '%{count} favoritos',
    empty: {
      title: 'Aún no tienes favoritos.',
      subtitle: 'Desliza a la derecha los nombres que te gusten.',
      cta: 'Deslizar nombres',
    },
  },
  matches: {
    title: 'Tus matches',
    soon: 'Muy pronto',
    noCouple: {
      title: 'Los matches son de a dos.',
      subtitle: 'Invita a tu pareja: cuando coincidan en un nombre, es un match.',
    },
    empty: {
      title: 'Todavía no coinciden.',
      subtitle: 'Sigan deslizando: el nombre anda por ahí.',
      cta: 'Deslizar nombres',
    },
  },
  gender: {
    f: 'Niña',
    m: 'Niño',
    x: 'Unisex',
  },
  surnames: {
    label: 'Probar con apellidos',
    first: 'Primer apellido',
    second: 'Segundo apellido',
    secondOptional: 'Segundo apellido (opcional)',
    swap: 'Invertir el orden de los apellidos',
  },
  library: {
    title: 'Tus decks',
    discover: 'Descubrir',
    close: 'Cerrar',
    filter: {
      label: 'Mostrar nombres de',
      all: 'Todos',
    },
    allNames: 'Todos los nombres',
    count: '%{count} nombres',
    progress: '%{seen} de %{total} vistos',
    active: 'Activo',
    activeA11y: '%{deck}, deck activo. %{progress}',
    deckA11y: '%{deck}. %{progress}',
  },
  onboarding: {
    skip: 'Saltar',
    step: 'Paso %{step} de %{total}',
    welcome: {
      title: 'Elijan el nombre de a dos',
      body: 'Cada persona desliza por su lado. Cuando coinciden en un nombre, es un match.',
      cta: 'Empezar',
    },
    swipe: {
      title: 'Desliza para decidir',
      body: 'A la derecha si te gusta, a la izquierda para pasar. Los botones de abajo hacen lo mismo.',
      cta: 'Entendido',
    },
    gender: {
      title: '¿Qué nombres quieres ver?',
      body: 'Los nombres unisex aparecen en todas las opciones. Puedes cambiarlo cuando quieras en la biblioteca.',
      girl: 'De niña',
      boy: 'De niño',
      all: 'Todos',
    },
    surnames: {
      title: '¿Cómo suena con apellido?',
      body: 'Verás cada nombre completo. Puedes cambiarlos cuando quieras en la biblioteca.',
      cta: 'Ver con apellidos',
      later: 'Ahora no',
    },
  },
};
