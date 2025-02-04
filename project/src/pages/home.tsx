import React from 'react';
import { Hero } from '../components/hero';
import { FeaturedProjects } from '../components/featured-projects';
import { Categories } from '../components/categories';
import { Stats } from '../components/stats';
import { Testimonials } from '../components/testimonials';
import { CallToAction } from '../components/call-to-action';

export function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <Categories />
      <Stats />
      <Testimonials />
      <CallToAction />
    </>
  );
}