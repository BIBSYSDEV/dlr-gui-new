import { Resource, ResourceOwner } from '../types/resource.types';
import { getResource, getResourceCreators, getResourceOwners } from '../api/resourceApi';
import { WorklistRequest } from '../types/Worklist.types';

const getResourceAndIgnoreFailure = async (resourceIdentifier: string): Promise<Resource | undefined> => {
  try {
    const resource = (await getResource(resourceIdentifier)).data;
    resource.creators = (await getResourceCreators(resourceIdentifier)).data;
    return resource;
  } catch (error) {
    return undefined;
  }
};

interface resourceOwnerAndResourceId {
  resourceOwners: ResourceOwner[];
  resourceIdentifier: string;
}

const getResourceOwnersAndIgnoreFailure = async (
  resourceIdentifier: string
): Promise<resourceOwnerAndResourceId | undefined> => {
  try {
    const resourceOwners = (await getResourceOwners(resourceIdentifier)).data;
    return {
      resourceOwners: resourceOwners,
      resourceIdentifier,
    };
  } catch (error) {
    return undefined;
  }
};

export const getWorkListWithResourceAttached = async (workList: WorklistRequest[]): Promise<WorklistRequest[]> => {
  const resourcePromises: Promise<Resource | undefined>[] = [];

  workList.forEach((work) => {
    resourcePromises.push(getResourceAndIgnoreFailure(work.resourceIdentifier));
  });
  const resources = await Promise.all(resourcePromises);

  return workList.map((work, index) => {
    if (resources[index]?.identifier === work.resourceIdentifier) {
      work.resource = resources[index];
    } else {
      work.resource = resources.find((resource) => resource?.identifier === work.identifier);
    }
    return work;
  });
};

export const getWorkListWithResourceAndOwnersAttached = async (
  workList: WorklistRequest[]
): Promise<WorklistRequest[]> => {
  const resourcePromises: Promise<Resource | undefined>[] = [];
  const ownersPromises: Promise<resourceOwnerAndResourceId | undefined>[] = [];
  workList.forEach((work) => {
    resourcePromises.push(getResourceAndIgnoreFailure(work.resourceIdentifier));
    ownersPromises.push(getResourceOwnersAndIgnoreFailure(work.resourceIdentifier));
  });
  const resources = await Promise.all(resourcePromises);
  const owners = await Promise.all(ownersPromises);

  return workList.map((work, index) => {
    if (resources[index]?.identifier === work.resourceIdentifier) {
      work.resource = resources[index];
    } else {
      work.resource = resources.find((resource) => resource?.identifier === work.identifier);
    }
    if (owners[index]?.resourceIdentifier === work.resourceIdentifier) {
      work.resourceOwners = owners[index]?.resourceOwners;
    } else {
      work.resourceOwners = owners.find(
        (ownersWithResourceIdentifier) => ownersWithResourceIdentifier?.resourceIdentifier === work.resourceIdentifier
      )?.resourceOwners;
    }

    return work;
  });
};

//Does not mutate input array
export const sortWorkListByDate = (workList: WorklistRequest[]): WorklistRequest[] => {
  return workList.slice().sort((workA, workB) => {
    const dateA = new Date(workA.submittedDate);
    const dateB = new Date(workB.submittedDate);
    return dateA.getTime() - dateB.getTime();
  });
};

//remove possible worklists without resource object
export const filterWorkListWithoutResources = (workList: WorklistRequest[]): WorklistRequest[] => {
  return workList.filter((work) => work.resource);
};
