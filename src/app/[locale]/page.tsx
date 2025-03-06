import { ArticleHero, ArticleTileGrid } from '@src/components/features/article';
import { client, previewClient } from '@src/lib/client';
import { defaultLocale, locales } from '@src/i18n/config';

import { Container } from '@src/components/shared/container';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageBlogPostOrder } from '@src/lib/__generated/sdk';
import TranslationsProvider from '@src/components/shared/i18n/TranslationProvider';
import { draftMode } from 'next/headers';
import { generateStatsigClient } from '@src/lib/statsigClient';
import { getExperimentUpdatedBlogPost } from '@src/lib/variantHelper';
import initTranslations from '@src/i18n';
import { notFound } from 'next/navigation';

interface LandingPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { isEnabled: preview } = draftMode();
  const gqlClient = preview ? previewClient : client;
  const landingPageData = await gqlClient.pageLanding({ locale: params.locale, preview });
  const page = landingPageData.pageLandingCollection?.items[0];

  const languages = Object.fromEntries(
    locales.map(locale => [locale, locale === defaultLocale ? '/' : `/${locale}`]),
  );
  const metadata: Metadata = {
    alternates: {
      canonical: '/',
      languages: languages,
    },
  };
  if (page?.seoFields) {
    metadata.title = page.seoFields.pageTitle;
    metadata.description = page.seoFields.pageDescription;
    metadata.robots = {
      follow: !page.seoFields.nofollow,
      index: !page.seoFields.noindex,
    };
  }

  return metadata;
}

export default async function Page({ params: { locale } }: LandingPageProps) {
  const { isEnabled: preview } = draftMode();
  const { t, resources } = await initTranslations({ locale });
  const gqlClient = preview ? previewClient : client;

  const landingPageData = await gqlClient.pageLanding({ locale, preview });
  const page = landingPageData.pageLandingCollection?.items[0];

  if (!page) {
    notFound();
  }

  const blogPostsData = await gqlClient.pageBlogPostCollection({
    limit: 6,
    locale,
    order: PageBlogPostOrder.PublishedDateDesc,
    where: {
      slug_not: page?.featuredBlogPost?.slug,
    },
    preview,
  });

  // implement the appropriate SDK for your app: a dummy SDK generated below
  // for example purposes
  const statsigClient = await generateStatsigClient();

  const posts = blogPostsData.pageBlogPostCollection?.items?.map(post =>
    getExperimentUpdatedBlogPost(statsigClient, post!),
  );

  if (!page?.featuredBlogPost || !posts) {
    return;
  }

  return (
    <TranslationsProvider locale={locale} resources={resources}>
      <Container>
        <Link href={`/${page.featuredBlogPost.slug}`}>
          <ArticleHero article={page.featuredBlogPost} />
        </Link>
      </Container>

      {/* Tutorial: contentful-and-the-starter-template.md */}
      {/* Uncomment the line below to make the Greeting field available to render */}
      {/*<Container>*/}
      {/*  <div className="my-5 bg-colorTextLightest p-5 text-colorBlueLightest">{page.greeting}</div>*/}
      {/*</Container>*/}

      <Container className="my-8  md:mb-10 lg:mb-16">
        <h2 className="mb-4 md:mb-6">{t('landingPage.latestArticles')}</h2>
        <ArticleTileGrid className="md:grid-cols-2 lg:grid-cols-3" articles={posts} />
      </Container>
    </TranslationsProvider>
  );
}
