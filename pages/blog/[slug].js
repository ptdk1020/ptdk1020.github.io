import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Markdown from '/components/Markdown'

import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'



export default function PostPage({frontmatter:{title,date,cover_image}, slug, contentHtml}){
    
    const div =     
                <div className='card-page'>
                    <h1 className='post-title'>{title}</h1>
                    <div>{date}</div>
                    <img src={cover_image}/>
                    <Markdown contentHtml={contentHtml}/>
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
                            .use(remarkRehype)
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