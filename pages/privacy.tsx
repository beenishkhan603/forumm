import { useRouter } from 'next/router'
import Box from '@components/base/Box'
import Link from 'next/link'
import { GoArrowLeft } from 'react-icons/go'
import { UnauthenticatedWrapper } from '@layouts/Wrapper'

const downloadLink =
  'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/Privacy_Notice+v4.0424.pdf'

export default function PrivacyPolicyPage() {
  const router = useRouter()
  return (
    <Box className="flex flex-col justify-center max-w-[1500px] mx-auto px-16 sm:px-24 md:px-32 mt-8">
      <div>
        <p>
          <span className="font-bold text-3xl">Privacy Notice</span>
        </p>
      </div>
      <Box>
        <p>
          If you&apos;re having trouble with this page, a downloadable version
          of our privacy notice can be found{' '}
          <Link
            className="font-bold text-forumm-blue underline"
            href={downloadLink}
          >
            here
          </Link>
        </p>
      </Box>
      <p id="h.gjdgxs">
        <span>
          This notice applies to all websites &amp; applications (including
          Forumm) developed and delivered by 448 Studio. 448 Studio{' '}
        </span>
        <span>
          is a registered company incorporated in Scotland under company number
          SC560399 and has a registered office at{' '}
        </span>
        <span>
          Barclays Eagle Labs, Beco Building, 58 Kingston Street, Glasgow, G5
          8BP
        </span>
        <span>. </span>
        <span>
          All significant decisions about data processing and policy
          implementation will be made using UK GDPR (General Data Protection
          Regulation). This notice is set out to help you understand the types
          of data that we collect from you, and/or your business, and how that
          data is used and managed.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Commitment </span>
      </p>
      <p>
        <span>
          448 Studio are committed to protecting the privacy and security of
          your personal data. We continually monitor compliance through
          implementing policies &amp; procedures to safeguard data and by
          setting regular reviews to manage these policies and procedures.{' '}
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Data Controller</span>
      </p>
      <p id="h.30j0zll">
        <span>
          In accordance with ICO requirements of Data Controllers 448 Studio
        </span>
        <span>&nbsp;</span>
        <span>
          is registered with the Information Commissioners Office (ZB171646)
        </span>
        <span>. </span>
        <span>448 Studio</span>
        <span>&nbsp;</span>
        <span>
          provides products and services to universities &amp; the public
          sector, including academic support programs, training workshops,
          consultancy &amp; Forumm Software. &nbsp;448 Studio will have several
          roles such as Data Controller, Joint Controller &amp; Processor. This
          will be defined by contractual agreements.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">About Us&nbsp;</span>
      </p>
      <p>
        <span>
          448 Studio&rsquo;s core mission is to share knowledge and empower
          people to learn how to use social and digital media effectively. We
          offer social media workshops, training, consultancy &amp; Forumm
          software that supports the public sector and higher education. We work
          with research and academic groups to ensure they have all the tools
          and confidence to share their research and knowledge
          effectively.&nbsp;
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Information we collect.</span>
      </p>
      <p>
        <span className="font-bold text-xl">Website &amp; Forumm</span>
      </p>
      <p>
        <span className="font-bold text-xl">
          Personal information you disclose to us
        </span>
        <span>.</span>
      </p>
      <p>
        <span>
          We collect personal information that you voluntarily provide to us
          when you register on the Website, express an interest in obtaining
          information about us or our products and Services, when you
          participate in activities on the Website (such as by posting messages
          in our online forums or entering competitions, contests or giveaways)
          or otherwise when you contact us.
        </span>
      </p>
      <p>
        <span>
          The personal information that we collect depends on the context of
          your interactions with us and the Website, the choices you make and
          the products and features you use. The personal information we collect
          may include the following:
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">
          Personal Information Provided by You.
        </span>
        <span>
          &nbsp;We collect names; phone numbers; email addresses; mailing
          addresses; job titles; usernames; passwords; contact preferences;
          contact or authentication data; billing addresses; debit/credit card
          numbers; personal picture; company/organisation; and other similar
          information.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Payment Data.</span>
        <span>
          &nbsp; 448 will only collect residual data collect data necessary to
          process your payment if you make purchases or make donations such as
          transaction number amount. All payment data is stored by Stripe. Your
          card information is collected and processed through Stripe directly
          from out websites and platforms. You will find their privacy notice
          link(s) here:&nbsp;
        </span>
        <span>
          <a href="https://www.google.com/url?q=https://stripe.com/privacy&amp;sa=D&amp;source=editors&amp;ust=1712832725135110&amp;usg=AOvVaw0G4QBLKs3Wml7-gPuucmv1">
            https://stripe.com/privacy
          </a>
        </span>
        <span>.</span>
      </p>
      <p>
        <span className="font-bold text-xl">
          Information automatically collected.
        </span>
      </p>
      <p>
        <span>
          Some information &mdash; such as your Internet Protocol (IP) address
          and/or browser and device characteristics &mdash; is collected
          automatically when you visit our website.
        </span>
      </p>
      <p>
        <span>
          We automatically collect certain information when you visit, use or
          navigate the Website. This information does not reveal your specific
          identity (like your name or contact information) but may include
          device and usage information, such as your IP address, browser and
          device characteristics, operating system, language preferences,
          referring URLs, device name, country, location, information about how
          and when you use our website and other technical information. This
          information is primarily needed to maintain the security and operation
          of our website, and for our internal analytics and reporting purposes.
        </span>
      </p>
      <p>
        <span>
          &#8203;Like many businesses, we also collect information through
          cookies and similar technologies.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">
          The information we collect includes:
        </span>
      </p>
      <ul>
        <li>
          <span className="font-bold text-lg">Log and Usage Data.</span>
          <span>
            &nbsp;Log and usage data is service-related, diagnostic, usage and
            performance information our servers automatically collect when you
            access or use our Website and which we record in log files.
            Depending on how you interact with us, this log data may include
            your IP address, device information, browser type and settings and
            information about your activity in the Website (such as the
            date/time stamps associated with your usage, pages and files viewed,
            searches and other actions you take such as which features you use),
            device event information (such as system activity, error reports
            (sometimes called &lsquo;crash dumps&rsquo;) and hardware settings).
          </span>
        </li>
      </ul>
      <ul>
        <li>
          <span className="font-bold text-lg">Device Data.</span>
          <span>
            &nbsp;We collect device data such as information about your
            computer, phone, tablet or other device you use to access the
            Website. Depending on the device used, this device data may include
            information such as your IP address (or proxy server), device and
            application identification numbers, location, browser type, hardware
            model Internet service provider and/or mobile carrier, operating
            system, and system configuration information.
          </span>
        </li>
      </ul>
      <ul>
        <li>
          <span className="font-bold text-lg">Location Data.</span>
          <span>
            &nbsp;We collect location data such as information about your
            device&rsquo;s location, which can be either precise or imprecise.
            How much information we collect depends on the type and settings of
            the device you use to access the Website. For example, we may use
            GPS and other technologies to collect geolocation data that tells us
            your current location (based on your IP address). You can opt out of
            allowing us to collect this information either by refusing access to
            the information or by disabling your Location setting on your
            device. Note however, if you choose to opt out, you may not be able
            to use certain aspects of the Services.
          </span>
        </li>
      </ul>
      <p>
        <span>
          &#39;Cookies&#39; are small pieces of information sent by an
          organisation to your computer and stored on your hard drive to allow
          that website to recognise you when you visit. They collect statistical
          data about your browsing actions and patterns and do not identify you
          as an individual. example, we use cookies to store your country
          preference. This helps us to improve our website and deliver a better,
          more personalised service. It is possible to switch off cookies by
          setting your browser preferences. Turning cookies off may result in a
          loss of functionality when using our websites.
        </span>
      </p>
      <p>
        <span>
          If you would like to opt-out of Google Analytics monitoring your
          behaviour on our website, please use this link (
        </span>
        <span>https://tools.google.com/dlpage/gaoptout/</span>
        <span>)</span>
      </p>
      <p className="font-bold text-xl">
        <span>3</span>
        <span>rd</span>
        <span>&nbsp;Parties </span>
      </p>
      <p>
        <span>
          Our websites &amp; information we share around events &amp; involving
          stakeholders may contain links to other websites run by other
          organisations. For example, we use a 3
        </span>
        <span>rd</span>
        <span>
          &nbsp;party payment service provider for ticket purchases. When you
          sign up to an event you will be directed to the payment providers
          website and once your transaction has been completed, you will be
          returned to 448 Studio&rsquo;s website. This privacy notice applies
          only to our website&sbquo; so we encourage you to read the privacy
          statements on the other websites you visit. We cannot be responsible
          for the privacy policies and practices of other sites even if you
          access them using links from our website. In addition, if you linked
          to our website from a third-party site, we cannot be responsible for
          the privacy policies and practices of the owners and operators of that
          third party site and recommend that you check the policy of that third
          party site.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Social Media</span>
      </p>
      <p>
        <span>448 Studio </span>
        <span>
          can be found on social media platforms such as Facebook, Instagram,
          Twitter and LinkedIn, Eventbrite &amp; Meetup. These platforms are an
          important part of our business efforts, so you may be presented with
          retargeting ads &amp; emails in future following a visit to our
          website. We may target ads at audiences that we believe match the
          profile of our target audience and would therefore be interested in
          our services. We may tag or mention you whe
        </span>
        <span>n</span>
        <span>
          &nbsp;we are carrying out business promotion /collaborations.{' '}
        </span>
      </p>
      <p>
        <span>These platforms are run by commercial companies and </span>
        <span>448 Studio </span>
        <span>
          is not the Data Controller or Data Processor of your
          social/professional media profile. You should contact these social
          media platforms directly if you have concerns over how your personal
          data is being used and stored by them.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Seminars &amp; Workshops</span>
      </p>
      <p>
        <span>We collect and process the following information:</span>
      </p>
      <a id="t.b6e8cad946cef15b7b88cc5761ff2e9b1048c886"></a>
      <a id="t.0"></a>
      <table>
        <tr>
          <td colSpan={1} rowSpan={1}>
            <ul>
              <li>
                <span>First Name &amp; Surname</span>
              </li>
              <li>
                <span>Email Address</span>
              </li>
            </ul>
            <ul>
              <li>
                <span>University </span>
              </li>
              <li>
                <span>Academic Objectives</span>
              </li>
              <li>
                <span>Academic Achievements</span>
              </li>
              <li>
                <span>Event attendance</span>
              </li>
            </ul>
          </td>
          <td colSpan={1} rowSpan={1}>
            <ul>
              <li>
                <span>IP Address</span>
              </li>
              <li>
                <span>In event location</span>
              </li>
              <li>
                <span>Statistical B2B Communication </span>
              </li>
              <li>
                <span>News</span>
              </li>
              <li>
                <span>Videos</span>
              </li>
            </ul>
          </td>
        </tr>
      </table>
      <p>
        <span></span>
      </p>
      <p>
        <span className="font-bold text-xl">Donations</span>
      </p>
      <p>
        <span>
          When you make a donation to us, we need to collect some of your
          personal information. This is done through our on-line donation portal
          on Forumm. We&rsquo;ll always collect, use, and store your data
          responsibly, and make sure your data is protected. The information we
          collect when you donate is name, contact details and payment details.
          This information is then passed on to our payment platform for
          donations, which is hosted by Stripe (
        </span>
        <span>
          <a href="https://www.google.com/url?q=https://stripe.com/en-gb/privacy&amp;sa=D&amp;source=editors&amp;ust=1712832725137973&amp;usg=AOvVaw3b1W_dvfx2PRaeHwZabzq8">
            Privacy Notice
          </a>
        </span>
        <span>)</span>
        <span>.</span>
        <span>
          &nbsp;When you use our secure online payment function you will be
          directed to Stripe, who will receive your financial information to
          process the transaction. We will not directly store your financial
          details as needed for these transactions. We will provide your
          personal information to Stripe only to the extent necessary for the
          purpose of processing your payment.{' '}
        </span>
      </p>
      <p>
        <span>
          We do not share your data with third parties for marketing purposes,
          however we will share your details with universities we collaborate
          with or are working on behalf of and in circumstances where the
          university is the data controller. Our lawful basis for processing
          your data in these circumstances is contractual.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">How we use your information</span>
      </p>
      <p>
        <span>
          We process your information for purposes based on legitimate business
          interests, the fulfilment of our contract with you, compliance with
          our legal obligations, and/or your consent.
        </span>
      </p>
      <p>
        <span>
          We use personal information collected via our website for a variety of
          business purposes described below. We process your personal
          information for these purposes in reliance on our legitimate business
          interests, in order to enter into or perform a contract with you, with
          your consent, and/or for compliance with our legal obligations. We
          indicate the specific processing grounds we rely on next to each
          purpose listed below.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">
          We use the information we collect or receive:
        </span>
      </p>
      <ul>
        <li>
          <span>
            To facilitate account creation and logon process. If you choose to
            link your account with us to a third-party account (such as your
            Google or Facebook account), we use the information you allowed us
            to collect from those third parties to facilitate account creation
            and logon process for the performance of the contract.
          </span>
        </li>
        <li>
          <span>
            To post testimonials. We post testimonials on our website that may
            contain personal information. Prior to posting a testimonial, we
            will obtain your
          </span>
          <span>&nbsp;</span>
          <span>
            consent to use your name and the content of the testimonial. If you
            wish to update, or delete your testimonial, please contact us at{' '}
          </span>
          <span>
            <a href="mailto:hello@forumm.to">hello@forumm.to</a>
          </span>
          <span>&nbsp;</span>
          <span>
            and be sure to include your name, testimonial location, and contact
            information.
          </span>
        </li>
        <li>
          <span>
            Request feedback. We may use your information to request feedback
            and to contact you about your use of our website.
          </span>
        </li>
        <li>
          <span>
            To enable user-to-user communications. We may use your information
            in order to enable user-to-user communications with each
            user&rsquo;s consent.
          </span>
        </li>
        <li>
          <span>
            To manage user accounts. We may use your information for the
            purposes of managing our account and keeping it in working order.
          </span>
        </li>
        <li>
          <span>
            To send administrative information to you. We may use your personal
            information to send you product, service, and new feature
            information and/or information about changes to our terms,
            conditions, and policies.
          </span>
        </li>
        <li>
          <span>
            To protect our Services. We may use your information as part of our
            efforts to keep our website safe and secure (for example, for fraud
            monitoring and prevention).
          </span>
        </li>
        <li>
          <span>
            To enforce our terms, conditions, and policies for business
            purposes, to comply with legal and regulatory requirements or in
            connection with our contract.
          </span>
        </li>
        <li>
          <span>
            To respond to legal requests and prevent harm. If we receive a
            subpoena or other legal request, we may need to inspect the data we
            hold to determine how to respond.
          </span>
        </li>
        <li>
          <span>
            Fulfil and manage your orders. We may use your information to fulfil
            and manage your orders, payments, returns, and exchanges made
            through the website.
          </span>
        </li>
        <li>
          <span>
            Administer prize draws and competitions. We may use your information
            to administer prize draws and competitions when you elect to
            participate in our competitions.
          </span>
        </li>
        <li>
          <span>
            To deliver and facilitate delivery of services to the user. We may
            use your information to provide you with the requested service.
          </span>
        </li>
        <li>
          <span>
            To respond to user enquiries/offer support to users. We may use your
            information to respond to your inquiries and solve any potential
            issues you might have with the use of our Services.\
          </span>
        </li>
        <li>
          <span>
            To send you marketing and promotional communications. We and/or our
            third-party marketing partners may use the personal information you
            send to us for our marketing purposes if this is in accordance with
            your marketing preferences. For example, when expressing an interest
            in obtaining information about us or our website, subscribing to
            marketing or otherwise contacting us, we will collect personal
            information from you. You can opt-out of our marketing emails at any
            time.
          </span>
        </li>
        <li>
          <span>
            Deliver targeted advertising to you. We may use your information to
            develop and display personalised content and advertising (and work
            with third parties who do so) tailored to your interests and/or
            location and to measure its effectiveness.
          </span>
        </li>
        <li>
          <span>
            For other business purposes. We may use your information for other
            business purposes, such as data analysis, identifying usage trends,
            determining the effectiveness of our promotional campaigns and to
            evaluate and improve our website, products, marketing, and your
            experience. We may use and store this information in aggregated and
            anonymised form so that it is not associated with individual end
            users and does not include personal information. We will not use
            identifiable personal information without your consent.
          </span>
        </li>
      </ul>
      <p>
        <span></span>
      </p>
      <p>
        <span className="font-bold text-xl">Who are our Stakeholders?</span>
      </p>
      <p>
        <span>
          Clients, Universities, Associates, Delegates, Supporting
          Organisations, Suppliers, Statutory &amp; Regulatory Bodies
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">International</span>
      </p>
      <p>
        <span></span>
      </p>
      <p>
        <span>
          448 Studio has global reach delivering services to individuals from
          around the world who are undertaking further education in the academic
          sector. &nbsp;These Colleges &amp; Universities may not be in the same
          country that they reside. 448 workshop events are online and in person
          Attendees may be from countries from around the world. Due to this It
          is likely we will transfer, store, and process your information in
          countries other than your own.
        </span>
      </p>
      <p>
        <span>
          Our servers are located in United Kingdom, Ireland, and United States.
          If you are accessing our website from outside United Kingdom, Ireland,
          and United States, please be aware that your information may be
          transferred to, stored, and processed by us in our facilities and by
          those third parties with whom we may share your personal information
          worldwide, and other countries. We will take all necessary measures to
          protect your personal information in accordance with this privacy
          notice and applicable law.
        </span>
      </p>
      <p id="h.1fob9te">
        <span>
          All significant decisions about data processing and policy
          implementation will be made using UK GDPR &amp; EU GDPR. We take steps
          to ensure that appropriate security measures are taken with the aim of
          ensuring that your privacy rights continue to be protected as outlined
          in this Policy.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Lawful Basis</span>
      </p>
      <p>
        <span>
          We apply the GDPR principles to all personal &amp; Sensitive data that
          we hold or process.{' '}
        </span>
      </p>
      <p>
        <span>
          1) Processed lawfully, fairly and in a transparent manner in relation
          to individuals.{' '}
        </span>
      </p>
      <p>
        <span>
          2) Collected for specified, explicit and legitimate purposes and not
          further processed in a manner that is incompatible with those
          purposes; further processing for archiving purposes in the public
          interest, scientific or historical research purposes or statistical
          purposes shall not be incompatible with the initial purposes.{' '}
        </span>
      </p>
      <p>
        <span>
          3) Adequate, relevant, and limited to what is necessary in relation to
          the purposes for which they are processed.{' '}
        </span>
      </p>
      <p>
        <span>
          4) Accurate and, where necessary, kept up to date; every reasonable
          step must be taken to ensure that personal data that are inaccurate,
          having regard to the purposes for which they are processed, are
          erased, or rectified without delay.{' '}
        </span>
      </p>
      <p>
        <span>
          5) Kept in a form which permits identification of data subjects for no
          longer than is necessary for the purposes for which the personal data
          are processed; personal data may be stored for longer periods insofar
          as the personal data will be processed solely for archiving purposes
          in the public interest, scientific or historical research purposes or
          statistical purposes subject to implementation of the appropriate
          technical and organisational measures required by the GDPR in order to
          safeguard the rights and freedoms of individuals.{' '}
        </span>
      </p>
      <p>
        <span>
          6) Processed in a manner that ensures appropriate security of the
          personal data, including protection against unauthorised or unlawful
          processing and against accidental loss, destruction, or damage, using
          appropriate technical or organisational measures.
        </span>
      </p>
      <p>
        <span>
          Under the General Data Protection Regulation (The GDPR) we rely on
          consent for processing your personal information. Individual consent
          is provided by you when browsing our websites and when registering
          &amp; attending events virtually or in person. Some of our
          business-to-business events use contractual basis and Legitimate basis
          depending on the job role and relationship you have with 448 Studio.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Sharing Information </span>
      </p>
      <p>
        <span>
          We use third party hosting for this website and associated data
          processing is carried out only to provide you with user friendly
          functionality.
        </span>
      </p>
      <p>
        <span>
          We will share names, email addresses, pictures, job roles and
          organisational information as part of business-to-business networking
          events &amp; with organisations &amp; contractors commissioned to
          assist &amp; co-ordinate these events.
        </span>
      </p>
      <p>
        <span>
          Pre &amp; post event/online seminar management will include grouped
          online communications such as meeting invites in meeting chats and
          document sharing. Others attending may see your name email address and
          may see conversation responses and questions you may ask.{' '}
        </span>
      </p>
      <p>
        <span>
          Where an Organisation has commissioned us to host an online seminar or
          event, your registration &amp; attendance information &amp; any
          feedback you provide will be shared with this Organisation.
        </span>
      </p>
      <p>
        <span>
          As part of our virtual event experience, we may operate external
          online random name pickers for our competition prize draws which
          involve adding your name for entry.
        </span>
      </p>
      <p>
        <span>
          We use contractors &amp; associates to manage various business
          processes, we will share your information with them to carry out this
          function.
        </span>
      </p>
      <p>
        <span>
          We may be required to transfer your information to a third party as
          part of a sale of some or all our business assets to third party as
          part of any business restructuring or{' '}
        </span>
        <span>reorganisation</span>
        <span>. </span>
      </p>
      <p>
        <span>
          We may also be required to disclose or share your personal data to
          comply with any legal obligation or to enforce or apply our terms of
          use or to protect the rights, property or safety of our supporters and
          customers. However, we will take steps with the aim of ensuring that
          your privacy rights continue to be protected.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Children</span>
      </p>
      <p>
        <span>
          We do not anticipate providing services directly to children, however
          we do understand that if this change occurs, we will make provisions
          to verify age. We will also make further provisions to gain parental
          or guardian consent for data processing activity where required.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">
          Protecting your personal information{' '}
        </span>
      </p>
      <p>
        <span>
          448 Studio will continue to look for new ways to protect data.
          However, in the event of a data breach we will notify the ICO
          (Information Commissioners Office) within 72 hours of becoming aware
          of the breach. Where we do not yet have all the relevant details, we
          will notify you when we expect to have the results of the
          investigation. We use the ICO guidance framework on managing a
          security breach to guide us.
        </span>
      </p>
      <p>
        <span className="font-bold text-xl">Your data protection rights.</span>
      </p>
      <p>
        <span>Under data protection law, you have rights including:</span>
      </p>
      <p>
        <span>Your right of access</span>
        <span>
          &nbsp;- You have the right to ask us for copies of your personal
          information.{' '}
        </span>
      </p>
      <p>
        <span>Your right to rectification</span>
        <span>
          &nbsp;- You have the right to ask us to rectify personal information
          you think is inaccurate. You also have the right to ask us to complete
          information you think is incomplete.{' '}
        </span>
      </p>
      <p>
        <span>Your right to erasure</span>
        <span>
          &nbsp;- You have the right to ask us to erase your personal
          information in certain circumstances.{' '}
        </span>
      </p>
      <p>
        <span>Your right to restriction of processing</span>
        <span>
          &nbsp;- You have the right to ask us to restrict the processing of
          your personal information in certain circumstances.{' '}
        </span>
      </p>
      <p>
        <span>Your right to object to processing</span>
        <span>
          &nbsp;- You have the the right to object to the processing of your
          personal information in certain circumstances.
        </span>
      </p>
      <p>
        <span>Your right to data portability</span>
        <span>
          &nbsp;- You have the right to ask that we transfer the personal
          information you gave us to another organisation, or to you, in certain
          circumstances.
        </span>
      </p>
      <p>
        <span>Your right to object to automated decision making &ndash; </span>
        <span>
          You have the right not to be subject to the use of entirely automated
          decisions which produce legal effects or significantly affect
          individuals.
        </span>
      </p>
      <p>
        <span>
          You are not required to pay any charge for exercising your rights. If
          you make a request, we have one month to respond to you.
        </span>
      </p>
      <p>
        <span>Please contact us at</span>
        <span>&nbsp;</span>
        <span>
          <a href="mailto:hello@448.studio">hello@forumm.to</a>
        </span>
        <span>&nbsp;</span>
        <span>or</span>
      </p>
      <div className="text-center">
        <p>
          Barclays Eagle Labs,
          <br /> Beco Building
          <br /> 58 Kingston Street
          <br /> Glasgow
          <br /> G5 8BP
        </p>
      </div>
      <br /> if you wish to make a request.
      <span className="font-bold text-xl">Regulatory Information</span>
      <p>
        <span>Further information around your rights can be found at</span>
        <span>&nbsp; </span>
        <span>
          <a href="https://www.google.com/url?q=https://ico.org.uk/your-data-matters&amp;sa=D&amp;source=editors&amp;ust=1712832725142033&amp;usg=AOvVaw3aOqeS2J8A-FRT-Wt0Dkf4">
            https://ico.org.uk/your-data-matters
          </a>
        </span>
        <span>&nbsp;</span>
      </p>
      <p>
        <span>
          The ICO&rsquo;s address: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </span>
      </p>
      <p>
        <span>Information Commissioner&rsquo;s Office</span>
      </p>
      <div className="text-center">
        <p>
          Wycliffe House
          <br /> Water Lane
          <br /> Wilmslow
          <br /> Cheshire
          <br /> SK9 5AF
        </p>
      </div>
      <div className="text-center">
        <p>
          <span>&nbsp;Privacy Notice V</span>
          <span>4</span>
          <span>&nbsp;</span>
          <span>10</span>
          <span>/</span>
          <span>04</span>
          <span>/202</span>
          <span>4</span>
          <span>&nbsp;GPR/GDPR01 </span>
          <span>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp;{' '}
          </span>
        </p>
        <p>
          <span></span>
        </p>
      </div>
      <Box
        className="flex items-center justify-center gap-2 cursor-pointer w-full my-8 hover:underline"
        onClick={() => router.push('/dashboard')}
      >
        <GoArrowLeft />
        Back to Dashboard
      </Box>
    </Box>
  )
}

PrivacyPolicyPage.Layout = UnauthenticatedWrapper
