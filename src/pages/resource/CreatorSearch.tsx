import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import styled from 'styled-components';
import CreatorPublishedAccordion from './CreatorPublishedAccordion';

const StyledCreatorPublishedAccordion = styled(CreatorPublishedAccordion)`
  margin-bottom: 1rem;
`;

interface CreatorSearchProps {
  resource: Resource;
}

const CreatorSearch: FC<CreatorSearchProps> = ({ resource }) => {
  return (
    <>
      {resource.creators
        .filter((creator) => !!creator.features.dlr_creator_name)
        .map((creator) => (
          <StyledCreatorPublishedAccordion key={creator.identifier} creator={creator} parentResource={resource} />
        ))}
    </>
  );
};

export default CreatorSearch;
