import Link from 'next/link'

export default function Post({post}){
    return(<>
            <Link href={`/blog/${post.slug}`} className='card'>
                <img src={post.frontmatter.cover_image}/>
                <div className='post-date'>Last Updated: {post.frontmatter.date}</div>
                <h3 className='post-title'>{post.frontmatter.title}</h3>
                <p>{post.frontmatter.excerpt}</p>
           </Link>
           </>)
}