import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Post from '/components/Post'

export default function Blog({posts}) {
  const html_body = 
    <div className='posts'>
      {posts.map((post,index)=><Post post={post} key={index}></Post>)}
    </div>
  return html_body
}

export async function getStaticProps(){
  // can fetch data from api, but we'll fetch it from the folder
  const files = fs.readdirSync(path.join('posts'))

  // get slug and frontmatter from posts
  const posts = files.map(filename => {
    // get slug
    const slug = filename.replace('.md','')
    // get front matter
    const markdown = fs.readFileSync(path.join('posts',filename),'utf-8');
    const {data:frontmatter} = matter(markdown);
    return {slug,frontmatter}
  })

  return {
    props: {
      posts,
    }
  }
}