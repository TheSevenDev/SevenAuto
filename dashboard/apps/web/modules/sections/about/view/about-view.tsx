'use client';

import { Container } from '@mui/material';
import { IPost } from '@seven-auto/libs';
import { ContentView } from 'modules/components/editor';

import AboutHero from '../about-hero';

// import AboutWhat from '../about-what';
// import AboutTeam from '../about-team';
// import AboutVision from '../about-vision';
// import AboutTestimonials from '../about-testimonials';

// ----------------------------------------------------------------------

export default function AboutView({ post }: { post: IPost }) {
  return (
    <>
      <AboutHero />

      {/* <AboutWhat /> */}

      {/* <AboutVision /> */}

      {/* <AboutTeam /> */}

      {/* <AboutTestimonials /> */}
      {post?.content && (
        <Container
          sx={{
            py: { xs: 10, md: 15 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <ContentView content={post.content || ''} />
        </Container>
      )}
    </>
  );
}
