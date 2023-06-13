import {createElement, Fragment, useEffect, useState} from 'react'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import rehypePrism from 'rehype-prism'


function useProcessor(text) {
    const [Content, setContent] = useState(Fragment)
  
    useEffect(() => {
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeReact, {createElement, Fragment})
        .use(rehypePrism)
        .process(text)
        .then((file) => {
          setContent(file.result)
        })
    }, [text])

    return Content
  }

export default function Markdown({contentHtml}){
    return useProcessor(contentHtml)
}