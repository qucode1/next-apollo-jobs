import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Job = ({ job }) => (
    <div className="card">
        <style jsx>{`
      .card {
        margin-top: 20px;
      }
    `}</style>
        <header className="card-header">
            <p className="card-header-title">{job.title}</p>
        </header>
        <div className="card-content">
            <div className="content">{job.description}</div>
        </div>
        <footer className="card-footer">
            <div className="card-footer-item">
                Address: {job.locations[0].address}
            </div>
            <div className="card-footer-item">
                lng: {job.locations[0].coordinates[0]}
            </div>
            <div className="card-footer-item">
                lat: {job.locations[0].coordinates[1]}
            </div>
        </footer>
    </div>
);

const JobList = ({ data }) => {
    const { error, allJobs } = data;
    if (error) {
        return <div>Error loading jobs.</div>;
    }
    if (allJobs && allJobs.length) {
        return (
            <section>
                <ul>{allJobs.map(job => <Job key={job.id} job={job} />)}</ul>
            </section>
        );
    }
    return <div>Loading</div>;
};

export const allJobs = gql`
  query {
    allJobs {
      id
      title
      description
      locations {
          type
          coordinates
          address
      }
    }
  }
`;
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (JobList)
export default graphql(allJobs)(JobList);