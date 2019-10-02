import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
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
    const tree = renderer
      .create(
        <Layout>
          <span>Test</span>
        </Layout>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
