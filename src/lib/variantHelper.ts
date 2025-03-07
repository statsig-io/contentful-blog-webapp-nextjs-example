import {
  PageBlogPostFieldsFragment,
  PageBlogPostWithExperimentFieldsFragment,
  RichImageFieldsFragment,
  StatsigExperimentFieldsFragment,
} from '@src/lib/__generated/sdk';

import { StatsigClient } from '@statsig/js-client';

export function getExperimentUpdatedBlogPost(
  statsigClient: StatsigClient,
  blogPost: PageBlogPostWithExperimentFieldsFragment,
): PageBlogPostFieldsFragment {
  const statsigExperiment = blogPost.statsigExperiment;
  // if this Blog Post has no associated Statsig variant container,
  // return it as is
  if (!statsigExperiment) {
    return blogPost;
  }

  // pull the experimentId from the fragment
  const experimentId = statsigExperiment.experimentId!;
  // use your Statsig SDK to get the associated Statsig experiment
  const experiment = statsigClient.getExperiment(experimentId);
  // grab the 'variantName' parameter from the Statsig experiment
  const variantName = experiment.get('variantName') as string;

  // use your helper function to choose the right image to serve based on
  // the variant name returned from the Statsig experiment's paramater
  const featuredImageVariation = getVariation<RichImageFieldsFragment>(
    variantName,
    statsigExperiment,
  );

  // return your Blog Post with the Featured Image from your experiment
  return {
    ...blogPost,
    featuredImage: featuredImageVariation?.image ?? blogPost?.featuredImage,
  };
}

export function getVariation<T>(
  variantName: string,
  experimentFields: StatsigExperimentFieldsFragment,
): T {
  const controlVariation = experimentFields.controlVariation!;
  const treatmentVariations = experimentFields.treatmentVariationsCollection!.items;

  if (variantName === 'control') {
    return controlVariation as T;
  }

  if (!variantName.startsWith('treatment-')) {
    throw new Error(`Unrecognized variantName parameter.`);
  }

  const variantIndex = Number(variantName.split('-')[1]) - 1;
  if (variantIndex == null || variantIndex < 0 || variantIndex >= treatmentVariations.length) {
    throw new Error(`Invalid treatment variant index.`);
  }

  return treatmentVariations[variantIndex] as T;
}
