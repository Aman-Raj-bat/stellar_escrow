import { useState, useCallback } from 'react';

export const useClipboard = (timeout = 2000) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), timeout);
      });
    },
    [timeout]
  );

  return { hasCopied, copyToClipboard };
};
