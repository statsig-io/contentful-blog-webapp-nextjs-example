# Contentful Statsig Integration Blog Page Example

This Repository serves as an example of how you can integrate your application to use Statsig's Contentful Integration. Before proceeding, follow the guide in [these docs](https://docs.statsig.com/guides/contentful/) to setup your Contentful space to be configured with Statsig.

## Integration Instructions

This example shows how you can run experiments on `page - Blog post`s, serving different `component - Rich image`s to users through a Statsig experiment automatically generated via Contentful.

Make sure to checkout [Contentful's Next.js Blog Starter Template](https://github.com/contentful/template-blog-webapp-nextjs/tree/bc28265) to get your test Blog Page app started first.

### Setup a Statsig SDK

You will need a Statsig SDK to get your Statsig experiment assignment for a given user. To add a Statsig js-client sdk to your Blog Page app, run the command:

```yarn add @statsig/js-client```

Now, add a client SDK key as a `STATSIG_SDK_KEY` in your `.env` file (see [`.env.example`](https://github.com/statsig-io/contentful-blog-webapp-nextjs-example/blob/main/.env.example)). You can setup an example statsig client following [this changeset](https://github.com/statsig-io/contentful-blog-webapp-nextjs-example/pull/5/commits/f18bae9b60cc944deeb12f5c8862072024cd9b84) as a guide.

### Add Experiment Fields to GraphQL

Now you can setup your experiments to be pulled through GraphQL. Follow [this changeset](https://github.com/statsig-io/contentful-blog-webapp-nextjs-example/pull/5/commits/545697b54af182fe55d93994369a2b205fe3387f) as a guide.

### Add Experiment to Content Types

Now that the graphql fragments are setup, we can add our experiment to each place the content types are used. In [this changeset](https://github.com/statsig-io/contentful-blog-webapp-nextjs-example/pull/5/commits/8be42a98c02a2a20586f91bd4433d0aa923aef84), we will replace the Featured Image of our blogs with the content pulled from the associated Statsig experiemnt for all blogs on the landing page. This is highly customizable, and can be adapted to fit your actual app's exact needs. [this changeset](https://github.com/statsig-io/contentful-blog-webapp-nextjs-example/pull/5/commits/8be42a98c02a2a20586f91bd4433d0aa923aef84) also outlines the mapping between the experiment in Contentful, and the associated parameter of the experiment in Statsig.
