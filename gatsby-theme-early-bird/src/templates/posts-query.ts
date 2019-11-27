import { graphql } from "gatsby";
import { Posts } from "../components/Posts";

export default Posts;

export const query = graphql`
  query PostsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allBlogPost(sort: { fields: [date, title], order: DESC }, limit: 1000) {
      edges {
        node {
          id
          excerpt
          slug
          title
          isoDate: date
          date(formatString: "MMMM DD, YYYY")
          # tags
          featuredImage {
            childImageSharp {
              # Generate Picture up to 8K 4:3 ratio, crop and cover as appropriate
              fluid(
                maxWidth: 7680
                maxHeight: 5760
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
      }
    }
  }
`;
