import { useEffect, useRef } from 'react';

/**
 * Custom hook to return the previous value of an object created by useState().
 *
 * @param {object} value Value whose previous state is to be remembered.
 * @returns {object} Previous value
 */
export default function usePrevious (value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value, ref]);
  return ref.current;
}
