import { graphql } from "gatsby";
import { PostTemplate } from "../components/Post";

export default PostTemplate;

export const query = graphql`
  query PostPageQuery($id: String!, $previousId: String, $nextId: String) {
    site {
      siteMetadata {
        title
      }
    }
    blogPost(id: { eq: $id }) {
      id
      excerpt
      body
      slug
      title
      tags
      keywords
      date(formatString: "MMMM DD, YYYY")
      featuredImage {
        childImageSharp {
          # Generate Picture up to 8K 16:9 ration, crop and cover as appropriate
          fluid(
            maxWidth: 7680
            maxHeight: 4320
            cropFocus: CENTER
            fit: COVER
            srcSetBreakpoints: [
              256
              512
              768
              1024
              # 720p
              1280
              # 1080p
              1920
              # 4k
              3840
              # 5k
              5120
              # 8k
              7680
            ]
          ) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
    previous: blogPost(id: { eq: $previousId }) {
      id
      excerpt
      slug
      title
      date(formatString: "MMMM DD, YYYY")
    }
    next: blogPost(id: { eq: $nextId }) {
      id
      excerpt
      slug
      title
      date(formatString: "MMMM DD, YYYY")
    }
  }
`;
