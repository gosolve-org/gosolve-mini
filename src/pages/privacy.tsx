import { Layout } from "components/common";
import StyledToast from "components/common/Layout/StyledToast";

import { useAuth } from "context/AuthContext";

function Privacy() {
	const { user } = useAuth();

	const renderPrivacyPage = () => (
		<div className="flex min-h-full flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="min-w-[75%]">
				<h1 className="mb-5">Privacy policy</h1>
				<section className="pb-10 pb-xl-10">
					<div className="container">
						<p className="mb-5">
							At goSolve, accessible from gosolve.org, one of our
							main priorities is the privacy of our visitors. This
							Privacy Policy document contains types of
							information that is collected and recorded by
							goSolve and how we use it.
						</p>
						<p className="mb-5">
							If you have additional questions or require more
							information about our Privacy Policy, do not
							hesitate to contact us at{" "}
							<a
								href="mailto:gdpr%40%67%6F%73%6F%6C%76%65%2E%6F%72%67"
								className="safe-contact"
								data-econtact-name="gdpr"
							>
								gdpr@gosolve.org
							</a>
							.
						</p>
						<h2 className="mb-5">
							General Data Protection Regulation (GDPR)
						</h2>
						<p className="mb-5">
							We are a Data Controller of your information.
						</p>
						<p className="mb-5">
							goSolve legal basis for collecting and using the
							personal information described in this Privacy
							Policy depends on the Personal Information we
							collect and the specific context in which we collect
							the information:
						</p>
						<ul className="mb-5">
							<li>
								- goSolve needs to perform a contract with you
							</li>
							<li>
								- You have given goSolve permission to do so
							</li>
							<li>
								- Processing your personal information is in
								goSolve legitimate interests
							</li>
							<li>- goSolve needs to comply with the law</li>
						</ul>
						<p className="mb-5">
							goSolve will retain your personal information only
							for as long as is necessary for the purposes set out
							in this Privacy Policy. We will retain and use your
							information to the extent necessary to comply with
							our legal obligations, resolve disputes, and enforce
							our policies.
						</p>
						<p className="mb-5">
							If you are a resident of the European Economic Area
							(EEA), you have certain data protection rights. If
							you wish to be informed what Personal Information we
							hold about you and if you want it to be removed from
							our systems, please contact us at{" "}
							<a
								href="mailto:gdpr%40%67%6F%73%6F%6C%76%65%2E%6F%72%67"
								className="safe-contact"
								data-econtact-name="gdpr"
							>
								gdpr@gosolve.org
							</a>
							.
						</p>
						<p className="mb-5">
							In certain circumstances, you have the following
							data protection rights:
						</p>
						<ul className="mb-5">
							<li>
								- The right to access, update or to delete the
								information we have on you.
							</li>
							<li>- The right of rectification.</li>
							<li>- The right to object.</li>
							<li>- The right of restriction.</li>
							<li>- The right to data portability</li>
							<li>- The right to withdraw consent</li>
						</ul>
						<h2 className="mb-5">Log Files</h2>
						<p className="mb-5">
							goSolve follows a standard procedure of using log
							files. These files log visitors when they visit
							websites. All hosting companies do this and a part
							of hosting services&apos; analytics. The information
							collected by log files include internet protocol
							(IP) addresses, browser type, Internet Service
							Provider (ISP), date and time stamp, referring/exit
							pages, and possibly the number of clicks. These are
							not linked to any information that is personally
							identifiable. The purpose of the information is for
							analyzing trends, administering the site, tracking
							users&apos; movement on the website, and gathering
							demographic information.
						</p>
						<h2 className="mb-5">Cookies and Web Beacons</h2>
						<p className="mb-5">
							Like any other website, goSolve uses
							&apos;cookies&apos;. These cookies are used to store
							information including visitors&apos; preferences,
							and the pages on the website that the visitor
							accessed or visited. The information is used to
							optimize the users&apos; experience by customizing
							our web page content based on visitors&apos; browser
							type and/or other information.
						</p>
						<h2 className="mb-5">Privacy Policies</h2>
						<p className="mb-5">
							You may consult this list to find the Privacy Policy
							for each of the advertising partners of goSolve.
						</p>
						<p className="mb-5">
							Third-party ad servers or ad networks uses
							technologies like cookies, JavaScript, or Web
							Beacons that are used in their respective
							advertisements and links that appear on goSolve,
							which are sent directly to users&apos; browser. They
							automatically receive your IP address when this
							occurs. These technologies are used to measure the
							effectiveness of their advertising campaigns and/or
							to personalize the advertising content that you see
							on websites that you visit.
						</p>
						<p className="mb-5">
							Note that goSolve has no access to or control over
							these cookies that are used by third-party
							advertisers.
						</p>
						<h2 className="mb-5">Third Party Privacy Policies</h2>
						<p className="mb-5">
							goSolve&apos;s Privacy Policy does not apply to
							other advertisers or websites. Thus, we are advising
							you to consult the respective Privacy Policies of
							these third-party ad servers for more detailed
							information. It may include their practices and
							instructions about how to opt-out of certain
							options.{" "}
						</p>
						<p className="mb-5">
							You can choose to disable cookies through your
							individual browser options. To know more detailed
							information about cookie management with specific
							web browsers, it can be found at the browsers&apos;
							respective websites.
						</p>
						<h2 className="mb-5">Children&apos;s Information</h2>
						<p className="mb-5">
							Another part of our priority is adding protection
							for children while using the internet. We encourage
							parents and guardians to observe, participate in,
							and/or monitor and guide their online activity.
						</p>
						<p className="mb-5">
							goSolve does not knowingly collect any Personal
							Identifiable Information from children under the age
							of 13. If you think that your child provided this
							kind of information on our website, we strongly
							encourage you to contact us immediately and we will
							do our best efforts to promptly remove such
							information from our records.
						</p>
						<h2 className="mb-5">Online Privacy Policy Only</h2>
						<p className="mb-5">
							Our Privacy Policy applies only to our online
							activities and is valid for visitors to our website
							with regards to the information that they shared
							and/or collect in goSolve. This policy is not
							applicable to any information collected offline or
							via channels other than this website.
						</p>
						<h2 className="mb-5">Consent</h2>
						<p className="mb-5">
							By using our website, you hereby consent to our
							Privacy Policy and agree to its terms.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
	return user ? (
		<Layout>{renderPrivacyPage()}</Layout>
	) : (
		<>
			{renderPrivacyPage()}
			<StyledToast />
		</>
	);
}

export default Privacy;
