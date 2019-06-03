import React from 'react';
import Link from 'gatsby-link';
import moment from 'moment';
import './style.scss';

class Project extends React.Component {
  render() {
    const { title, date, category, description, url, tags } = this.props.data.node.frontmatter;
    const { slug, categorySlug, tagSlugs } = this.props.data.node.fields;

    const tagsBlock = (
      <div className="project-single__tags">
        <ul className="project-single__tags-list">
          {tagSlugs && tagSlugs.map((tagSlug, i) => (
            <li className="project-single__tags-list-item" key={tagSlug} style={{ margin: 0 }}>
              <Link to={tagSlug} className="project-single__tags-list-item-link">
                {tags[i]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );

    return (
      <div className="project">
        <div className="project__meta">
          <time className="project__meta-time" dateTime={moment(date).format('MMMM D, YYYY')}>
            {moment(date).format('MMMM YYYY')}
          </time>
          <span className="project__meta-divider" />
          <span className="project__meta-category" key={categorySlug}>
            <Link to={categorySlug} className="project__meta-category-link">
              {category}
            </Link>
          </span>
          <span>
            <a href={url} className="project__github">Github</a>
          </span>
        </div>
        <h2 className="project__title">
          <Link className="project__title-link" to={slug}>{title}</Link>
        </h2>
        <p className="project__description">{description}</p>
        {tagsBlock}
        <Link className="project__readmore" to={slug}>Read</Link>
      </div>
    );
  }
}

export default Project;
