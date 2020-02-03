import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import { default as Posts } from "./posts-query";
import { WindowLocation } from "@reach/router";
import { HelmetProvider } from "react-helmet-async";

describe("Posts Page", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object => ({
      site: {
        siteMetadata: {
          title: "Test Site",
          siteUrl: "http://example.dev"
        }
      }
    }));
  });

  it("renders as expected", () => {
    const helmetContext: { helmet?: {} } = {};
    const tree = renderer.create(
      <HelmetProvider context={helmetContext}>
        <Posts
          data={{
            allBlogPost: {
              edges: [
                {
                  node: {
                    id: "42",
                    excerpt:
                      "This is a sample from a blog post, without a featured image.",
                    slug: "/2019-12-24-test-post-without-featured-image",
                    title: "Test Post (without Featured Image)",
                    isoDate: "2019-12-24",
                    date: "Dec 24, 2019"
                  }
                },
                {
                  node: {
                    id: "43",
                    excerpt:
                      "This is a sample from a blog post, with a featured image.",
                    slug: "/2019-12-24-test-post-with-featured-image",
                    title: "Test Post (with Featured Image)",
                    isoDate: "2019-12-25",
                    date: "Dec 25, 2019",
                    featuredImage: {
                      childImageSharp: {
                        sqip: {
                          dataURI: "data:image/svg+xml"
                        },
                        fluid: {
                          aspectRatio: 1,
                          src:
                            "/static/sample_image_1_hash/1/sample_image_1.jpeg",
                          srcSet:
                            "/static/sample_image_1_hash/1/sample_image_1.jpeg 1x",
                          sizes: "(min-width 512px)"
                        }
                      }
                    }
                  }
                }
              ]
            }
          }}
          location={{ pathname: "/" } as WindowLocation}
        />
      </HelmetProvider>
    );
    expect(tree).toMatchSnapshot();
    expect(helmetContext.helmet).toMatchSnapshot();
  });
});
