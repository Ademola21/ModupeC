import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';

const DMCAPage: React.FC = () => {
  return (
    <StaticPageLayout title="DMCA Notice">
      <p>
        CeniMax respects the intellectual property rights of others and expects its users to do the same. This platform is a non-commercial demonstration project and all content displayed is for illustrative purposes only.
      </p>
      <p className="mt-4">
        In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website at <a href="http://www.copyright.gov/legislation/dmca.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 dark:text-gray-200 underline hover:no-underline">http://www.copyright.gov/legislation/dmca.pdf</a>, we will respond expeditiously to claims of copyright infringement committed using the CeniMax service that are reported to our Designated Copyright Agent.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">Filing a DMCA Notice of Infringement</h2>
      <p>
        If you are a copyright owner, or are authorized to act on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit a notice to our Copyright Agent with the following information:
      </p>
      <ul className="list-decimal pl-6 mt-4 space-y-2">
        <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest;</li>
        <li>A description of the copyrighted work that you claim has been infringed;</li>
        <li>A description of where the material that you claim is infringing is located on our website;</li>
        <li>Your address, telephone number, and email address;</li>
        <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</li>
        <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
      </ul>

      <p className="mt-6">
        Our Designated Copyright Agent for notice of claims of copyright infringement can be reached as follows:
      </p>
      <p className="mt-2">
        <strong>Copyright Agent, CeniMax Legal Department</strong><br/>
        Email: <a href="mailto:copyright@cenimax.com" className="font-semibold text-gray-800 dark:text-gray-200 underline hover:no-underline">copyright@cenimax.com</a>
      </p>
      <p className="mt-4">
        Please note that this procedure is exclusively for notifying CeniMax that your copyrighted material has been infringed.
      </p>
    </StaticPageLayout>
  );
};

export default DMCAPage;