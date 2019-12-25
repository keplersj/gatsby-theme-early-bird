import { graphql } from "gatsby";
import { Posts } from "../components/Posts";

export default Posts;

export const query = graphql`
  query EarlyBirdPostsPageQuery {
    allBlogPost(sort: { fields: [date, title], order: DESC }, limit: 1000) {
      edges {
        node {
          ...EarlyBirdPostsPage
        }
      }
    }
  }
`;
