// Copy en español neutro (ligeramente chileno donde tenga sentido). Ver DESIGN.md §7.
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
    empty: {
      title: 'Aún no tienes favoritos.',
      subtitle: 'Desliza a la derecha los nombres que te gusten.',
      cta: 'Deslizar nombres',
    },
  },
  matches: {
    title: 'Tus matches',
    noCouple: {
      title: 'nombra.me funciona de a dos.',
      subtitle: 'Invita a tu pareja y cuando a ambos les guste el mismo nombre, es un match.',
      cta: 'Invitar a tu pareja',
      comingSoon: 'La vinculación de parejas llega pronto.',
    },
    empty: {
      title: 'Todavía no coinciden.',
      subtitle: 'Sigan deslizando — el nombre anda por ahí.',
      cta: 'Deslizar nombres',
    },
  },
  gender: {
    f: 'Niña',
    m: 'Niño',
    x: 'Neutro',
  },
  library: {
    title: 'Tus decks',
    discover: 'Descubrir',
    filter: {
      label: 'Mostrar nombres de',
      all: 'Todos',
    },
    allNames: 'Todos los nombres',
    allNamesDescription: 'El catálogo completo, sin filtro temático.',
    add: 'Agregar',
    added: 'Agregado',
    progress: '%{seen} de %{total} vistos',
    activeDeck: 'Deck activo',
  },
};
