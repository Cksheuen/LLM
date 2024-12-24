import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './markdown.css';
import './reset.css';
import ReactDOM from 'react-dom';
import style from './index.module.css';

async function markdownToHtml(markdown: string): Promise<string> {
  return marked(markdown);
}

interface ContentOptionBtnsProps {
  content: string;
}

function ContentOptionBtns({ content }: ContentOptionBtnsProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const options = [
    {
      icon: 'i-carbon-copy',
      label: '拷贝',
      onClick: () => {
        console.log('copy', content);
      },
    },
    /* {
            icon: 'i-carbon-reset',
            label: '刷新',
            onClick: () => {
                console.log('refresh');
            }
        } */
  ];
  return (
    <div
      ref={divRef}
      className="bg-gray-8 rd-2 text-3.5 absolute flex items-center justify-center gap-2.5 px-3 py-1.5"
    >
      {options.map((option, index) => (
        <div className={`${style.icon} shadow shadow-2xl`}>
          <div
            className={`hover:bg-gray-6 rd-2 relative cursor-pointer px-2 transition-all ${option.icon}`}
            key={index}
            onClick={option.onClick}
          ></div>
          <div
            className={`${style.description} bg-gray-9 rd-2 transition-duration-500 border-1 border-gray-5 absolute right-0 top-7 border-solid px-5 py-0.5 shadow shadow-2xl transition-all`}
          >
            {option.label}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ContentProps {
  markdown: string;
}

export default function Content({ markdown }: ContentProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const divEL = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markdownToHtml(markdown).then((html) => {
      setHtmlContent(html);
    });
  }, [markdown]);

  const AppendBtns = (el: HTMLElement) => {
    Array.from(el.children || []).forEach((child) => {
      const childElement = child as HTMLElement;
      if (childElement.tagName.toLowerCase() === 'code') {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.right = '1rem';
        container.style.top = '-1rem';

        const layout = childElement.parentElement as HTMLElement;
        layout.style.position = 'relative';
        layout.style.overflow = 'visible';
        layout.appendChild(container);
        ReactDOM.render(
          <ContentOptionBtns content={childElement.innerHTML} />,
          container,
        );
      } else if (childElement.children) {
        AppendBtns(childElement);
      }
    });
  };

  useEffect(() => {
    AppendBtns(divEL.current!);

    hljs.highlightAll();
  }, [divEL.current]);

  return (
    <div
      ref={divEL}
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
    // <ContentOptionBtns />
  );
}
