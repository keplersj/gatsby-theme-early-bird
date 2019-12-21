import { graphql } from "gatsby";
import { PostTemplate } from "../components/Post";

export default PostTemplate;

export const query = graphql`
  query PostPageQuery($id: String!) {
    blogPost(id: { eq: $id }) {
      ...EarlyBirdPostPage
    }
  }
`;
