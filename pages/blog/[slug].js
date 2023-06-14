import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Markdown from '/components/Markdown'

import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'



export default function PostPage({frontmatter:{title,date,cover_image}, slug, contentHtml}){
    
    const div =     
                <div className='card-page'>
                    <h1 className='post-title'>{title}</h1>
                    <div>{date}</div>
                    <img src={cover_image} className='post-image'/>
                    <div className='post-body'>
                        <Markdown contentHtml={contentHtml}/>
                    </div>
                </div>

    return div
}

export async function getStaticPaths(){
    const files = fs.readdirSync(path.join('posts'))
    const paths = files.map(filename => ({
        params: {
            slug: filename.replace('.md','')
        }
    }))

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params:{slug}}){
    const markdown = fs.readFileSync(path.join('posts',slug + '.md'),'utf-8');
    const {data:frontmatter, content} = matter(markdown);

    let contentHtml = await unified()
                            .use(remarkParse)
                            .use(remarkMath)
                            .use(remarkGfm)
                            .use(remarkRehype, {allowDangerousHtml: true})
                            .use(rehypeRaw)
                            // .use(rehypeSanitize) // sanitizing here seems to remove formatting as well
                            .use(rehypeMathjax)
                            .use(rehypeStringify)
                            .process(content)
    
    contentHtml = String(contentHtml)

    return {
        props: {
            frontmatter,
            slug,
            contentHtml
        },
    }
}