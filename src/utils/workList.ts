import { Resource } from '../types/resource.types';
import { getResource } from '../api/resourceApi';
import { WorklistRequest } from '../types/Worklist.types';

const getResourceAndIgnoreFailure = async (resourceIdentifier: string): Promise<Resource | undefined> => {
  try {
    const resourceResponse = await getResource(resourceIdentifier);
    return resourceResponse.data;
  } catch (_error) {
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
