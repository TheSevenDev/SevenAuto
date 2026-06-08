import { useEffect } from 'react';

// ----------------------------------------------------------------------

export function useScroll(id: string, offsetTop = 0) {
  useEffect(() => {
    // check url has hash and scroll to id
    const { hash } = window.location;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      // getBoundingClientRect
      if (element) {
        // element.scrollIntoView({ behavior: 'smooth' });
        const position = element?.getBoundingClientRect();
        window.scrollTo({
          top: position.top + window.pageYOffset - offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }, [id, offsetTop]);
}
