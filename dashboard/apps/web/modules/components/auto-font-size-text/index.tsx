import { useEffect, useRef, useState } from 'react';

export default function AutoFontSizeText({
  text,
  align = 'center',
  style,
  defaultSize = 24,
}: {
  align?: 'left' | 'center' | 'right';
  text: string;
  style?: React.CSSProperties;
  defaultSize?: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(defaultSize);

  useEffect(() => {
    const adjustFontSize = () => {
      const container = textRef.current;
      let currentFontSize = fontSize;
      if (container && container.scrollWidth && container.scrollHeight) {
        const minFontSize = 6;

        container.style.fontSize = `${currentFontSize}px`;

        while (
          (container.scrollWidth > container.offsetWidth ||
            container.scrollHeight > container.offsetHeight) &&
          currentFontSize > minFontSize
        ) {
          currentFontSize -= 1;
          container.style.fontSize = `${currentFontSize}px`;
        }
      }

      setFontSize(currentFontSize);
    };

    adjustFontSize();
  }, [text, fontSize]);

  return (
    <span
      ref={textRef}
      style={{
        width: `100%`,
        height: `100%`,
        fontSize: `${fontSize}px`,
        display: 'flex',
        justifyContent:
          align === 'center'
            ? 'center'
            : align === 'left'
              ? 'flex-start'
              : 'flex-end',
        alignItems: 'center',
        textAlign: align,
        wordWrap: 'break-word',
        whiteSpace: 'pre-line',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...style,
      }}
    >
      {text}
    </span>
  );
}
