import { Route, Routes } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { pages } from '@/data/site';
import Catering from '@/pages/Catering';
import Contact from '@/pages/Contact';
import Gallery from '@/pages/Gallery';
import Home from '@/pages/Home';
import Meetings from '@/pages/Meetings';
import NotFound from '@/pages/NotFound';
import Pricing from '@/pages/Pricing';
import Quote from '@/pages/Quote';
import Venue from '@/pages/Venue';

/** Routes are declared once and shared by the browser entry and the static prerender. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path={pages.venue.path} element={<Venue />} />
        <Route path={pages.pricing.path} element={<Pricing />} />
        <Route path={pages.catering.path} element={<Catering />} />
        <Route path={pages.gallery.path} element={<Gallery />} />
        <Route path={pages.contact.path} element={<Contact />} />
        <Route path={pages.quote.path} element={<Quote />} />
        <Route path={pages.meetings.path} element={<Meetings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
