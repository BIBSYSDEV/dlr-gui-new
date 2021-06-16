import { Resource } from '../types/resource.types';
import { getResource, getResourceCreators } from '../api/resourceApi';
import { WorklistRequest } from '../types/Worklist.types';

const getResourceAndIgnoreFailure = async (resourceIdentifier: string): Promise<Resource | undefined> => {
  try {
    const resource = (await getResource(resourceIdentifier)).data;
    const resourceCreators = (await getResourceCreators(resourceIdentifier)).data;
    resource.creators = resourceCreators;
    return resource;
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
