import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./Base";

beforeEach((): void => {
  (useStaticQuery as jest.Mock).mockImplementation((): object => ({
    site: {
      siteMetadata: {
        title: "",
        siteUrl: ""
      }
    }
  }));
});

describe("Base Layout", (): void => {
  it("renders correctly", (): void => {
    const context: { helmet?: any } = {};
    const tree = renderer
      .create(
        <HelmetProvider context={context}>
          <Layout>
            <span>Test</span>
          </Layout>
        </HelmetProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
    expect(context.helmet).toMatchSnapshot();
  });

  it("renders correctly with location provided", (): void => {
    const context: { helmet?: any } = {};
    const tree = renderer
      .create(
        <HelmetProvider context={context}>
          <Layout
            location={{
              key: "test",
              pathname: "/2016-11-9",
              search: "",
              hash: "test_hash",
              state: {}
            }}
          >
            <span>Test</span>
          </Layout>
        </HelmetProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
    expect(context.helmet).toMatchSnapshot();
  });
});
