import * as React from "react";
import { Link } from "gatsby";
import { Card } from "starstuff-components";

const spanSeparatorCharacter = "⸱";
const spanSeparator = ` ${spanSeparatorCharacter} `;

interface Props {
  location: string;
  title: string;
  publishDate: string;
  wordCount?: string;
  minutesNeededToRead?: string;
  description: string;
}

export const BlogPostItem = (props: Props): React.ReactElement<Props> => (
  <Card
    title={props.title}
    location={props.location}
    customLinkComponent={(title, location): React.ReactElement => (
      <Link to={location}>
        <h2>{title}</h2>
      </Link>
    )}
    supporting={
      <>
        <div>
          <span>Published {props.publishDate}</span>
          {/* <span>{spanSeparator}</span>
          <span>{props.wordCount} words</span>
          <span>{spanSeparator}</span>
          <span>{props.minutesNeededToRead} minute read</span> */}
        </div>
      </>
    }
  />
);
